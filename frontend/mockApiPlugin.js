import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbFilePath = path.resolve(__dirname, 'src/mock-db.json');

function loadDb() {
  if (!fs.existsSync(dbFilePath)) {
    return {
      user: { user: 'admin' },
      firms: [],
      events: [],
      contacts: [],
      meets: [],
      workshops: [],
      columns: [],
      columnsFilter: [],
    };
  }
  return JSON.parse(fs.readFileSync(dbFilePath, 'utf-8'));
}

function saveDb(data) {
  fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export function mockApiPlugin() {
  return {
    name: 'mock-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        const pathname = urlObj.pathname;

        // Only handle rest.php or index.php
        if (!pathname.startsWith('/rest.php') && pathname !== '/index.php') {
          return next();
        }

        // Handle CORS / options
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          return res.end();
        }

        // Read body if POST / PUT
        let body = null;
        if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
          body = await new Promise((resolve) => {
            let data = '';
            req.on('data', (chunk) => {
              data += chunk;
            });
            req.on('end', () => {
              try {
                resolve(data ? JSON.parse(data) : {});
              } catch (e) {
                resolve({});
              }
            });
          });
        }

        const db = loadDb();
        const json = (statusCode, data) => {
          res.statusCode = statusCode;
          res.setHeader('Content-Type', 'application/json; charset=UTF-8');
          res.end(JSON.stringify(data));
        };

        // Parse route segments after /rest.php
        let route = pathname.replace(/^\/rest\.php\/?/, '');
        // strip trailing slash
        if (route.endsWith('/')) {
          route = route.slice(0, -1);
        }
        const segments = route ? route.split('/') : [];

        // 1. User check
        if (segments[0] === 'user') {
          return json(200, db.user || { user: 'admin' });
        }

        // 2. Firms routes
        if (segments[0] === 'firms' || segments[0] === 'firm') {
          // GET /rest.php/firms/list
          if (req.method === 'GET' && segments[1] === 'list') {
            return json(200, db.firms);
          }

          // GET columns
          if (req.method === 'GET' && (segments[1] === 'columns' || segments[1] === 'columnsList')) {
            return json(200, db.columns || []);
          }
          if (req.method === 'GET' && segments[1] === 'columnsFilter') {
            return json(200, db.columnsFilter || []);
          }

          // GET /rest.php/firms/form
          if (req.method === 'GET' && segments[1] === 'form') {
            return json(200, {
              subjects: [
                { id: '1', name: 'ELE' },
                { id: '2', name: 'IT' },
              ],
            });
          }

          // GET single firm
          if (req.method === 'GET' && segments[1] && !isNaN(Number(segments[1]))) {
            const firm = db.firms.find((f) => String(f.id) === String(segments[1]));
            return json(200, firm || {});
          }

          // POST create firm
          if (req.method === 'POST') {
            const newId = String(Date.now());
            const newFirm = {
              id: newId,
              name: body.name || 'Nová firma',
              obor: body.obor || 'IT',
              'Významý partner': body['Významý partner'] || '',
              Velertr26: body.Velertr26 || '',
              Kontakty: 0,
              ...body,
            };
            db.firms.unshift(newFirm);
            saveDb(db);
            return json(200, newFirm);
          }

          // PUT update firm
          if (req.method === 'PUT') {
            const id = body.id || (segments[1] && !isNaN(Number(segments[1])) ? segments[1] : null);
            const index = db.firms.findIndex((f) => String(f.id) === String(id));
            if (index !== -1) {
              db.firms[index] = { ...db.firms[index], ...body };
              saveDb(db);
              return json(200, db.firms[index]);
            }
            return json(404, { error: 'Firm not found' });
          }

          // DELETE firm
          if (req.method === 'DELETE') {
            const id = segments[1] || body?.id;
            db.firms = db.firms.filter((f) => String(f.id) !== String(id));
            saveDb(db);
            return json(200, { success: true, message: 'Firm deleted' });
          }
        }

        // 3. Events routes
        if (segments[0] === 'events' || segments[0] === 'event') {
          // GET all events or by firm_id
          if (req.method === 'GET') {
            const firmId = segments[1];
            if (firmId && !isNaN(Number(firmId))) {
              const filtered = db.events.filter((e) => String(e.firm_id) === String(firmId));
              return json(200, filtered);
            }
            return json(200, db.events);
          }

          // POST create event
          if (req.method === 'POST') {
            const newId = String(Date.now());
            const newEvent = {
              id: newId,
              name: body.name || 'Nová akce',
              description: body.description || '',
              time_start: body.time_start || new Date().toISOString(),
              firm_id: body.firm_id || '',
              firma: body.firma || '',
              ...body,
            };
            db.events.unshift(newEvent);
            saveDb(db);
            return json(200, newEvent);
          }

          // PUT update event
          if (req.method === 'PUT') {
            const id = body.id || segments[1];
            const index = db.events.findIndex((e) => String(e.id) === String(id));
            if (index !== -1) {
              db.events[index] = { ...db.events[index], ...body };
              saveDb(db);
              return json(200, db.events[index]);
            } else if (body.name) {
              // If not found, insert
              const newEvent = { id: String(Date.now()), ...body };
              db.events.unshift(newEvent);
              saveDb(db);
              return json(200, newEvent);
            }
            return json(404, { error: 'Event not found' });
          }

          // DELETE event
          if (req.method === 'DELETE') {
            const id = segments[1] || body?.id;
            db.events = db.events.filter((e) => String(e.id) !== String(id));
            saveDb(db);
            return json(200, { success: true, message: 'Event deleted' });
          }
        }

        // 4. Contacts routes
        if (segments[0] === 'contacts' || segments[0] === 'contact') {
          if (req.method === 'GET') {
            const firmId = segments[1];
            if (firmId) {
              const filtered = db.contacts.filter((c) => String(c.firm_id) === String(firmId));
              return json(200, filtered);
            }
            return json(200, db.contacts);
          }

          if (req.method === 'POST') {
            const newId = String(Date.now());
            const newContact = {
              id: newId,
              firm_id: body.firm_id,
              surname: body.surname || '',
              email: body.email || '',
              phone: body.phone || '',
              mailto: body.email ? `mailto:${body.email}` : '',
              img: body.img || '',
              linkedin: body.linkedin || '',
              main: body.main ? '1' : '0',
              active_c: body.active_c ? '1' : '0',
              ...body,
            };
            db.contacts.push(newContact);
            saveDb(db);
            return json(200, newContact);
          }

          if (req.method === 'PUT') {
            const id = body.id || segments[1];
            const index = db.contacts.findIndex((c) => String(c.id) === String(id));
            if (index !== -1) {
              db.contacts[index] = { ...db.contacts[index], ...body };
              saveDb(db);
              return json(200, db.contacts[index]);
            }
            return json(404, { error: 'Contact not found' });
          }

          if (req.method === 'DELETE') {
            const id = segments[1] || body?.id;
            db.contacts = db.contacts.filter((c) => String(c.id) !== String(id));
            saveDb(db);
            return json(200, { success: true, message: 'Contact deleted' });
          }
        }

        // 5. Meets routes (schůzky)
        if (segments[0] === 'meets' || segments[0] === 'meet') {
          if (req.method === 'GET') {
            const firmId = segments[1];
            if (firmId) {
              const filtered = db.meets.filter((m) => String(m.firm_id) === String(firmId));
              return json(200, filtered);
            }
            return json(200, db.meets);
          }

          if (req.method === 'POST') {
            const newId = String(Date.now());
            const newMeet = {
              id: newId,
              firm_id: body.firm_id,
              date_time: body.date_time || new Date().toISOString(),
              notes: body.notes || '',
              ...body,
            };
            db.meets.push(newMeet);
            saveDb(db);
            return json(200, newMeet);
          }

          if (req.method === 'PUT') {
            const id = body.id || segments[1];
            const index = db.meets.findIndex((m) => String(m.id) === String(id));
            if (index !== -1) {
              db.meets[index] = { ...db.meets[index], ...body };
              saveDb(db);
              return json(200, db.meets[index]);
            }
            return json(404, { error: 'Meet not found' });
          }

          if (req.method === 'DELETE') {
            const id = segments[1] || body?.id;
            db.meets = db.meets.filter((m) => String(m.id) !== String(id));
            saveDb(db);
            return json(200, { success: true, message: 'Meet deleted' });
          }
        }

        // 6. Workshops routes (akce s firmou)
        if (segments[0] === 'workshops' || segments[0] === 'workshop') {
          if (req.method === 'GET') {
            const firmId = segments[1];
            if (firmId) {
              const filtered = db.workshops.filter((w) => String(w.firm_id) === String(firmId));
              return json(200, filtered);
            }
            return json(200, db.workshops);
          }

          if (req.method === 'POST') {
            const newId = String(Date.now());
            const newWS = {
              id: newId,
              firm_id: body.firm_id,
              date: body.date || new Date().toISOString().slice(0, 10),
              type: body.type || 'Workshop',
              notes: body.notes || '',
              ...body,
            };
            db.workshops.push(newWS);
            saveDb(db);
            return json(200, newWS);
          }

          if (req.method === 'PUT') {
            const id = body.id || segments[1];
            const index = db.workshops.findIndex((w) => String(w.id) === String(id));
            if (index !== -1) {
              db.workshops[index] = { ...db.workshops[index], ...body };
              saveDb(db);
              return json(200, db.workshops[index]);
            }
            return json(404, { error: 'Workshop not found' });
          }

          if (req.method === 'DELETE') {
            const id = segments[1] || body?.id;
            db.workshops = db.workshops.filter((w) => String(w.id) !== String(id));
            saveDb(db);
            return json(200, { success: true, message: 'Workshop deleted' });
          }
        }

        // 7. Practices & fallback
        if (segments[0] === 'practices') {
          return json(200, []);
        }
        if (segments[0] === 'campaigns') {
          return json(200, []);
        }
        if (segments[0] === 'stats') {
          return json(200, []);
        }

        // Fallback for any other rest route
        return json(200, []);
      });
    },
  };
}
