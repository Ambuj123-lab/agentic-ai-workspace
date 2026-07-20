import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = 'ur3293690-5a09e92504e29189fadf3be2';
    const response = await fetch('https://api.uptimerobot.com/v2/getMonitors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache'
      },
      body: `api_key=${apiKey}&format=json&custom_uptime_ratios=30&response_times=1`,
      next: { revalidate: 60 } // cache for 60 seconds
    });

    const data = await response.json();

    if (data.stat === 'ok' && data.monitors && data.monitors.length > 0) {
      const monitor = data.monitors[0];
      const uptime = parseFloat(monitor.custom_uptime_ratio).toFixed(2);
      const latency = monitor.average_response_time || monitor.response_times?.[0]?.value || 0;
      
      return NextResponse.json({
        uptime: `${uptime}%`,
        latency: `${latency}ms`
      });
    }

    return NextResponse.json({ uptime: '99.9%', latency: '240ms' }); // fallback
  } catch (error) {
    console.error('Uptime fetch error:', error);
    return NextResponse.json({ uptime: '99.9%', latency: '240ms' }); // fallback
  }
}
