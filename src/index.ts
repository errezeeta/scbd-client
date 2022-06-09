import app from "./app";

async function main() {
    const PORT = app.get('PORT');
    await app.listen(PORT);
    console.log('Servidor abierto en: ', PORT);
}

main();