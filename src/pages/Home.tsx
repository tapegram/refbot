const Home = () => {
  const videoSource =
    "https://d2fqimnt2xbeir.cloudfront.net/oWcSC8mbsMQ-BA-Z1-MS-1-TR-AC-01.mp4";

  return (
    <div>
      <video width="800" height="500" controls loop autoPlay muted>
        <source src={videoSource} type="video/mp4" />
      </video>
    </div>
  );
};

export default Home;
