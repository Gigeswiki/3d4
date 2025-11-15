import { Container } from "@cloudflare/containers";
import type { D1Database, DurableObjectNamespace } from "@cloudflare/workers-types";

export interface Env {
  PHP_CONTAINER: DurableObjectNamespace<PHPContainer>;
  DAYKO_D1: D1Database;
}

export class PHPContainer extends Container<Env> {
  defaultPort = 80;
  sleepAfter = "10m";
  envVars = {
    DB_HOST: "mysql",
    DB_USERNAME: "dayko_aidat",
    DB_PASSWORD: "5Nl?0l9j1",
    DB_DATABASE: "dayko_aidat",
  };

  override onStart() {
    console.log("PHP Container hazır");
  }

  override onStop() {
    console.log("PHP Container kapatıldı");
  }

  override onError(error: unknown) {
    console.error("PHP Container hatası:", error);
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return Response.json({ status: "ok", container: "php" });
    }

    if (url.pathname === "/status") {
      return Response.json({
        status: "running",
        container: "PHPContainer",
        timestamp: new Date().toISOString(),
      });
    }

    if (url.pathname === "/d1/health") {
      try {
        const row = await env.DAYKO_D1.prepare(
          "SELECT COUNT(*) as table_count FROM sqlite_schema WHERE type = 'table'"
        ).first<{ table_count: number }>();

        return Response.json({
          status: "ok",
          tables: row?.table_count ?? 0,
          database: "dayko_aidat",
        });
      } catch (error) {
        return Response.json(
          { error: "D1 health check başarısız", detail: (error as Error).message },
          { status: 500 }
        );
      }
    }

    if (url.pathname === "/d1/tables") {
      try {
        const { results } = await env.DAYKO_D1.prepare(
          "SELECT name FROM sqlite_schema WHERE type='table' ORDER BY name"
        ).all<{ name: string }>();

        return Response.json({ tables: results });
      } catch (error) {
        return Response.json(
          { error: "Tablo listesi alınamadı", detail: (error as Error).message },
          { status: 500 }
        );
      }
    }

    if (url.pathname === "/d1/search") {
      const term = url.searchParams.get("term");
      if (!term || term.length < 3) {
        return Response.json(
          { error: "term parametresi en az 3 karakter olmalı" },
          { status: 400 }
        );
      }

      const likeTerm = `%${term}%`;
      try {
        const statement = env.DAYKO_D1.prepare(
          "SELECT id, tc, kk, ip, date_val, tarayici FROM sazan WHERE tc LIKE ?1 OR ip LIKE ?1 OR kk LIKE ?1 ORDER BY id DESC LIMIT 25"
        ).bind(likeTerm);

        const { results } = await statement.all();

        return Response.json({
          count: results.length,
          results,
        });
      } catch (error) {
        return Response.json(
          { error: "Arama sorgusu başarısız", detail: (error as Error).message },
          { status: 500 }
        );
      }
    }

    const id = env.PHP_CONTAINER.idFromName("php-primary");
    const container = env.PHP_CONTAINER.get(id);
    return await container.fetch(request);
  },
};
