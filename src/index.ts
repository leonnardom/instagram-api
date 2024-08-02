import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchInstagramData(username: string): Promise<any[]> {
  try {
    const headers = {
      'User-Agent':
        'Mozilla/5.0 (iPhone; CPU iPhone OS 12_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 105.0.0.11.118 (iPhone11,8; iOS 12_3_1; en_US; en-US; scale=2.00; 828x1792; 165586599)'
    };

    const response = await axios.get(
      `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`,
      { headers }
    );

    if (!response.data.data) return [];

    return response.data.data.user.edge_owner_to_timeline_media.edges.map(
      ({ node }: any) => ({
        title: node.edge_media_to_caption.edges[0]?.node.text || '',
        views: node.is_video ? node.video_view_count : 'isPhoto',
        comments: node.edge_media_to_comment.count,
        date: node.taken_at_timestamp,
        likes: node.edge_media_preview_like.count,
        is_video: node.is_video,
        id: node.id,
        description: node.edge_media_to_caption.edges[0]?.node.text || '' // Descrição da publicação
      })
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching Instagram data:', error.message);
    } else {
      console.error('Unknown error:', error);
    }

    return [];
  }
}

// Função para buscar todas as mídias com retry
async function fetchAllMedia(username: string): Promise<any[]> {
  let media: any[] = [];

  let hash =
    'QVFDbGVxUHhHUV9UeWNDZC12ZmJPVndFVGJCQXg4WGZCWnJhS29MTHRobUZrSUZ0eGNBTG5PMVlqamxSX2ZDN3B6MUExaER5eGtpTHExVjdpZmFwWWs5Mg==';

  let retryCount = 0;

  const maxRetries = 5;
  const initialDelay = 1000; // 1 segundo

  while (true) {
    try {
      const url = `https://www.instagram.com/graphql/query/?query_hash=42323d64886122307be10013ad2dcc44&variables={"id":"46647438416","first":"50","after":"${hash}"}`;
      const response = await axios.get(url);

      if (
        response.data.message ===
        'Please wait a few minutes before you try again.'
      ) {
        throw new Error('Rate limit exceeded');
      }

      const edges = response.data.data.user.edge_owner_to_timeline_media.edges;

      edges.forEach(({ node }: any) => {
        media.push({
          title: node.edge_media_to_caption.edges[0]?.node.text || '',
          views: node.is_video ? node.video_view_count : 'isPhoto',
          comments: node.edge_media_to_comment.count,
          date: node.taken_at_timestamp,
          likes: node.edge_media_preview_like.count,
          is_video: node.is_video,
          id: node.id,
          description: node.edge_media_to_caption.edges[0]?.node.text || '' // Descrição da publicação
        });
      });

      if (
        !response.data.data.user.edge_owner_to_timeline_media.page_info
          .has_next_page
      ) {
        break;
      }

      hash =
        response.data.data.user.edge_owner_to_timeline_media.page_info
          .end_cursor;
      retryCount = 0; // reset retry count on successful request
    } catch (error: unknown) {
      console.error('Error fetching all media:', error);
      if (
        error instanceof Error &&
        error.message === 'Rate limit exceeded' &&
        retryCount < maxRetries
      ) {
        retryCount++;

        const delayTime = initialDelay * Math.pow(2, retryCount); // backoff exponencial

        console.log(`Retrying in ${delayTime / 1000} seconds...`);
        await delay(delayTime);
      } else {
        break;
      }
    }
  }

  return media;
}

app.get('/all-media/:username', async (req: Request, res: Response) => {
  console.log(`\x1b[34m[SCRAPPER]\x1b[0m`, `Starting Scrapper.`);

  const { username } = req.params;

  console.log(
    `\x1b[34m[NEW POST]\x1b[0m`,
    `New Post using USERNAME: ${username}`
  );

  try {
    const initialMedia = await fetchInstagramData(username);
    const allMedia = await fetchAllMedia(username);

    const combinedMedia = [...initialMedia, ...allMedia];

    if (combinedMedia.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found or no media available'
      });
    }

    return res.json({ success: true, data: combinedMedia });
  } catch (error: unknown) {
    console.error('Error fetching all media data:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`\x1b[34m[PORT]\x1b[0m`, `Server is running on port ${PORT}`);
});
