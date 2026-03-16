export default {
  async fetch(req) {

    const CORS = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    // GET simple → réponse OK pour vérifier que le Worker tourne
    if (req.method === 'GET') {
      return new Response(JSON.stringify({ status: 'ok', service: 'pharos-auth' }), {
        headers: { ...CORS, 'Content-Type': 'application/json' }
      });
    }

    // POST → échange du code Discord
    if (req.method === 'POST') {
      let code;
      try {
        const body = await req.json();
        code = body.code;
      } catch {
        return new Response(JSON.stringify({ error: 'invalid_json' }), {
          status: 400, headers: { ...CORS, 'Content-Type': 'application/json' }
        });
      }

      if (!code) {
        return new Response(JSON.stringify({ error: 'missing_code' }), {
          status: 400, headers: { ...CORS, 'Content-Type': 'application/json' }
        });
      }

      try {
        const res = await fetch('https://discord.com/api/oauth2/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: '1483200078092042300',
            client_secret: 'TON_CLIENT_SECRET',
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: 'https://BJBellum.github.io/PharosEnergy/auth/callback/',
          }),
        });

        const data = await res.json();
        return new Response(JSON.stringify(data), {
          headers: { ...CORS, 'Content-Type': 'application/json' }
        });

      } catch (e) {
        return new Response(JSON.stringify({ error: 'discord_fetch_failed', detail: e.message }), {
          status: 500, headers: { ...CORS, 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response('Method not allowed', { status: 405, headers: CORS });
  }
};
