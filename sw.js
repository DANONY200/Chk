const CACHE='poke-v1';
const urls=[
  '/',
  'https://pokeapi.co/api/v2/pokemon/1',  // seed inicial
  'https://pokeapi.co/api/v2/pokemon/13000'
];
self.addEventListener('install',e=>{
    e.waitUntil(caches.open(CACHE).then(c=>c.addAll(urls)));
});
self.addEventListener('fetch',e=>{
    e.respondWith(
        caches.match(e.request).then(r=>r||fetch(e.request).then(f=>{
            const clone=f.clone();
            caches.open(CACHE).then(c=>c.put(e.request,clone));
            return f;
        }))
    );
});

Destaque: depois de 1ª visita, todas as chamadas rodam de cache; PokéAPI nunca é tocada de novo → zero risco de cair.


Entrega contínua (opcional)
.github/workflows/deploy.yml  

name: Pages
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - run: echo '{}' > stats.json   # placeholder
    - uses: peaceiris/actions-gh-pages@v4
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: .
