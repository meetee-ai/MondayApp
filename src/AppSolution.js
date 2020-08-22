import React from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
const monday = mondaySdk();

class AppSolution extends React.Component {
  constructor(props) {
    super(props);

    // Default state
    this.state = {
      settings: {},
      context: {},
      name: "",
    };
  }

  componentDidMount() {
    // TODO: set up event listeners
    monday.listen("settings", (res) => {
      this.setState({ settings: res.data });
    });

    monday.api(`query { me { name } }`).then((res) => {
      this.setState({ name: res.data.me.name });
    });
  }


  ClickFinish(){
    monday.execute("confirm", {
      message: "Are you sure?", 
      confirmButton: "Let's go!", 
      cancelButton: "No way", 
      excludeCancelButton: false
   }).then((res) => {
       console.log(res.data);
       // {"confirm": true}
   });
  }
  render() {
    return (
      <div
        className="App"
        style={{ background: this.state.settings.background }}
      >
        Hello, {this.state.name}!
      </div>
    );
  }
}

export default AppSolution;
