import * as d3 from "d3";
import * as icons from "../assets/Icon/icons";



function citationText({ containerCitationText, data }) {
    var currentIndex = 0;
  
    containerCitationText.text(data[currentIndex].text);
  
    function update(delta) {
      let next = delta + currentIndex;
      if (next < 0 || next > data.length - 1) return;
  
      currentIndex = next;
      containerCitationText.text(data[currentIndex].text);
    }
  
    return update;
  }