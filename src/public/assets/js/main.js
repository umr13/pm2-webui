async function pm2AppAction(appName, action){
    const base = window.BASE_PATH || '';
    await fetch(`${base}/api/apps/${appName}/${action}`, { method: 'POST'})
    location.reload();
}