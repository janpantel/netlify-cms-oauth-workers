import { Router } from 'itty-router';
import auth from './routes/auth';
import callback from './routes/callback';

const router = Router();

router.get('/', async () => new Response('Hello.'));

router.get('/auth', auth);

router.get('/callback', callback);

addEventListener('fetch', event => event.respondWith(router.handle(event.request, event.request.headers)));
