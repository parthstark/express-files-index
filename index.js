const express = require("express")
const fs = require("fs")
const path = require('path');
const app = express()

const port = 3000

app.use(express.json())

app.get('/', (_, res) => {
    res.redirect('/index');
})

app.get('/:directory(*)', (req, res) => {
    const directory = req.params.directory
    const filePath = `./${directory}`

    fs.stat(filePath, (err, stats) => {
        if (err) {
            res.status(500).send(`
                <html>
                    <head>
                        <title>psk index</title>
                    </head>
                    <body>
                        <h3>File not found</h3>
                    </body>
                </html>
            `)
            return;
        }

        if (stats.isFile()) {
            res.sendFile(path.resolve(filePath));
            return;
        }

        fs.readdir(filePath, (_, files) => {
            const html = `
                <html>
                    <head>
                    <title>psk index</title>
                    </head>
                    <body>
                    <h3>Files in ${directory}:</h3>
                    <ul>
                    <li><a href="javascript:history.back()">..</li>
                        ${files.map((file) => {
                const fileOrFolderName = fs.statSync(path.join(filePath, file)).isDirectory()
                    ? `${file}/`
                    : file;

                return `<li><a href="/${directory}/${file}">${fileOrFolderName}</a></li>`;
            }).join('')
                }
                    </ul>
                    </body>
                </html>
                `
            res.status(200).send(html);
        });
    })
})

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
})