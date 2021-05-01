import Express from 'express';
import PGSQL from 'pg';
import File from 'fs';

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = "0";

const connectionString = process.env.DATABASE_URL;
const app = Express();
app.use(Express.static('public'));

app.post("/", (request, response) => {
    const pool = new PGSQL.Pool({
        connectionString,
        ssl: true,
    });
    pool.query("select ylink, ytitle, links from classLinks order by timestamp", (error, result) => {
        if(result)
            response.status(201).send(JSON.stringify(result.rows));
        else{
            console.log(error)
            response.status(500).send("{}");
        }
        pool.end();
    });
});

app.get("/", (request, response) => {
    File.readFile("./public/index.html", "utf-8", (error, content) => {
        if(content)
            response.status(200).send(content);
        else
            response.status(500).send("Server Error");
    });
})

app.listen(process.env.PORT, () => console.log("Server Started"))