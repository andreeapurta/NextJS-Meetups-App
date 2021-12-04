import { MongoClient } from "mongodb";

// /api/new-meetup
// POST /api/new-meetup

async function handler(req, res) {
  //the end point for creating a new meetup.
  if (req.method === "POST") {
    const data = req.body; //data=== object {title, image,address, description}

    const client = await MongoClient.connect(
      "mongodb+srv://andreea:qG5zAfZkWM0OOwRu@cluster0.k1tne.mongodb.net/meetups?retryWrites=true&w=majority"
    );
    const db = client.db(); //if it doesn't exist, will be created on the fly)

    const meetupsCollection = db.collection("meetups"); //hold of a collection by using your database and then the collection method

    const result = await meetupsCollection.insertOne(data); //inserting one new document in the collection //a document is just a object

    console.log(result);

    client.close(); //close db connection once done
     
    //send back with a response 
    //status == method - to set a HTTP status code of the response which will be returned.
    res.status(201).json({ message: "Meetup inserted!" });
  }
}

export default handler;
