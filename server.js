const express = require('express');
const path = require('path');
const fs = require('fs');
const db = require('./db/db.json');

// Method for generating unique ids
const { randomUUID } = require('crypto');
const { parse } = require('path');

// Heroku or localhost
const PORT = process.env.PORT || 3001;


const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));


app.get('/notes', (req, res) => {

    res.sendFile(path.join(__dirname, "/public/notes.html"))

});

// GET request for notes
app.get('/api/notes', (req, res) => {

    console.info(`${req.method} request received to notes`);

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        const parsedNote = JSON.parse(data);
        res.json(parsedNote);
    });
})

app.post('/api/notes', (req, res) => {

    console.info(`${req.method} request received to add a review`)

    const { title, text } = req.body

    if (title) {
        const newNote = {
            title,
            text,
            id: randomUUID()
        };


        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                const parsedNote = JSON.parse(data);
                parsedNote.push(newNote);

                fs.writeFile(
                    './db/db.json',
                    JSON.stringify(parsedNote, null, 4),
                    (writeErr) =>
                        writeErr ?
                            console.error(writeErr) :
                            console.info('Succesfully updated notes!'
                            ));
            }
        });

        const response = {
            status: 'success',
            body: newNote,
        };

        console.log(response);
        res.status(201).json(response)
    } else {
        alert('Note must have a Title')
        res.status(500).json('Error in posting Note')
    }
})

app.delete('/api/notes/:id', (req, res) => {
    console.log("delete was pressed!")
    const { id } = req.params;


    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            let preNotes = JSON.parse(data);
        
            let notes = preNotes.filter((note)=>{ 
            if(note.id!==id){
                return note
            }else{
            return
            }
        
        });


            fs.writeFile(
                './db/db.json',
                JSON.stringify(notes, null, 4),
                (writeErr) =>
                    writeErr ?
                        console.error(writeErr) :
                        console.info('Succesfully updated notes!'
            ));
            res.status(201)

        }
    });
})

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} ????`))