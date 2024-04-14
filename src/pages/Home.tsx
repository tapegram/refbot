/**
 * Should be eventually moved to the backend with dynamic list of values.
 * Before that, we could hide this behind a hook faking a backend call.
 *
 */
const HARD_CODED_VIDEO_NAMES = [
  "oWcSC8mbsMQ-BA-Z1-MS-1-TR-AC-01.mp4",
  "oWcSC8mbsMQ-BA-Z1-MS-4-TL-AC-04.mp4",
  "oWcSC8mbsMQ-BA-Z1-MS-8-TL-AC-08.mp4",
  "oWcSC8mbsMQ-Z1-MS-10-TR-RP-10.mp4",
  "oWcSC8mbsMQ-Z1-MS-11-TR-AC-11.mp4",
  "oWcSC8mbsMQ-Z1-MS-13-TR-AC-13.mp4",
  "oWcSC8mbsMQ-Z1-MS-14-TR-AC-14.mp4",
  "oWcSC8mbsMQ-Z1-MS-16-TR-AC-16.mp4",
  "oWcSC8mbsMQ-Z1-MS-3-TR-AN-03.mp4",
  "oWcSC8mbsMQ-Z1-MS-7-TL-AP-07.mp4",
  "oWcSC8mbsMQ-Z1-MS-9-TL-AC-09.mp4",
  "oWcSC8mbsMQ-Z2-MS-12-TR-RP-12.mp4",
  "oWcSC8mbsMQ-Z2-MS-15-TL-AC-15.mp4",
  "oWcSC8mbsMQ-Z2-MS-2-TR-AC-02.mp4",
  "oWcSC8mbsMQ-Z2-MS-5-TR-PR-05.mp4",
  "oWcSC8mbsMQ-Z2-MS-6-TL-AC-06.mp4",
];

const CN_VIDEO_BASE_URL = "https://d2fqimnt2xbeir.cloudfront.net";

const getRandomClipUrl = () => {
  const randomClipId =
    HARD_CODED_VIDEO_NAMES[
    Math.floor(Math.random() * HARD_CODED_VIDEO_NAMES.length)
    ];
  return `${CN_VIDEO_BASE_URL}/${randomClipId}`;
};

const Home = () => {
  const videoSource = getRandomClipUrl();

  return (
    <div>
      <video width="800" height="500" controls loop autoPlay muted>
        <source src={videoSource} type="video/mp4" />
      </video>
    </div>
  );
};

export default Home;
