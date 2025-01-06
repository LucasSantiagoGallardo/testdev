
./src/app/test33/_document.js
2:1  Error: `<Document />` from `next/document` should not be imported outside of `pages/_document.js`. See: https://nextjs.org/docs/messages/no-document-import-in-page  @next/next/no-document-import-in-page
10:11  Error: Synchronous scripts should not be used. See: https://nextjs.org/docs/messages/no-sync-scripts  @next/next/no-sync-scripts
20:11  Error: Synchronous scripts should not be used. See: https://nextjs.org/docs/messages/no-sync-scripts  @next/next/no-sync-scripts

./src/components/admin/pedidos.tsx
20:6  Warning: React Hook useEffect has a missing dependency: 'fetchElections'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps

./src/components/pedidos/historicouser.tsx
103:15  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element

./src/components/user/userDashboard.tsx
41:6  Warning: React Hook useEffect has missing dependencies: 'dni', 'fetchElections', and 'fetchTodayMenu'. Either include them or remove the dependency array.  react-hooks/exhaustive-deps
106:19  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element
131:25  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element

./src/components/user/userElection.tsx
85:21  Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` to automatically optimize images. This may incur additional usage or cost from your provider. See: https://nextjs.org/docs/messages/no-img-element  @next/next/no-img-element

./src/components/usermenuselection.tsx
65:6  Warning: React Hook useEffect has a missing dependency: 'menuColors'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps

info  - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/basic-features/eslint#disabling-rules
   Linting and checking validity of types  .