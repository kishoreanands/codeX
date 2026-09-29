export default function handler(req, res) {
  res.status(200).json({
    status: 'ok',
    platform: 'Vercel Serverless',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
}
