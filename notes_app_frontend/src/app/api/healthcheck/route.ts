import { NextResponse } from 'next/server';

/**
 * PUBLIC_INTERFACE
 * GET /api/healthcheck
 * Returns a simple health status for development and monitoring.
 *
 * Response:
 * {
 *   status: 'ok',
 *   time: '<ISO timestamp>'
 * }
 *
 * Notes:
 * - This route is safe to include in all environments.
 * - It provides basic JSON output without external dependencies.
 * - Avoids incompatible exports with static output configuration.
 */
export async function GET() {
  try {
    const payload = {
      status: 'ok',
      time: new Date().toISOString(),
    };

    const res = NextResponse.json(payload, {
      status: 200,
    });
    // Ensure no caching, suitable for health checks
    res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.headers.set('Pragma', 'no-cache');
    res.headers.set('Expires', '0');
    res.headers.set('Surrogate-Control', 'no-store');
    return res;
  } catch {
    // In the unlikely case of an error, still respond with JSON structure
    return NextResponse.json(
      { status: 'error', time: new Date().toISOString() },
      { status: 500 }
    );
  }
}

// Note: Do not export `dynamic = 'force-dynamic'` here because this app
// uses static export during CI, which is incompatible with that flag.
