import CustomImageComponent from "./CustomImageComponent";
import "./App.css";

const App = () => {
  const imageUrl = "/api/assets/img/hmweb.jpg"; // Replace with your image URL

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to My Image Fetching App</h1>
        <p style={{ color: "blue" }}>
          Objective: Rewrite the <strong>img</strong> component in react to save
          images in a cache{" "}
        </p>
        <p>
          Solution: image -&gt; blob --&gt; base64 -&gt; localstorage -&gt;
          base64 -&gt; blob -&gt; url
        </p>
        <CustomImageComponent
          imageUrl={imageUrl}
          className="App-logo round-image"
          alt="logo"
        />
        <p style={{ fontSize: "smaller" }}>
          Detail: This app uses the CustomImageComponent to fetch an image from
          a provided URL, convert the blob object it to base64, and store it in
          local storage then convert it back to a blob object that is used to
          generate a new image url.
        </p>
        <p>
          You can add all <code>img</code> attrubtes as props except for{" "}
          <code>src</code> (of course) which you replace with{" "}
          <code>imageUrl</code>
        </p>
      </header>
    </div>
  );
};

export default App;
