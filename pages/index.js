import { MongoClient } from "mongodb";
import Head from "next/head";
import MeetupList from "../components/meetups/MeetupList";

function HomePage(props) {
  return (
    <>
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="Browse a huge list of highly active React meetups!"
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </>
  );
}

//Any code you write in here will always run on the server, never in the client.
//This getServerSideProps function runs for every incoming requests anyways, so there is no need to revalidate every x seconds.
//you do have access to the incoming request and all its headers and the request body if you need to
// export async function getServerSideProps(context) {
//   const req = context.req;
//   const res = context.res;

//   return {
//     props: DUMMY_MEETUPS,
//   };
// }

// works only in component files inside of the pages folder.
// This is a reserved name so to say. NextJS will look for a function with that name and if it finds it, it executes this function during this pre-rendering process.
// called first, before the component
// NextJS will wait for this promise to resolve, which means it waits until your data is loaded and then you return the props for this component function
// typically you set a props here ( needs to be names props!!)
export async function getStaticProps() {
  // fetch data from an API
  const client = await MongoClient.connect(
    "mongodb+srv://andreea:qG5zAfZkWM0OOwRu@cluster0.k1tne.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray(); // find() will by default find all the documents in that collection - find returns a promise

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    //if data does change more frequently - incremental Static Generation
    revalidate: 1, // would be regenerated on the server at least every second if there are requests coming in for this page.
  };
}

export default HomePage;
