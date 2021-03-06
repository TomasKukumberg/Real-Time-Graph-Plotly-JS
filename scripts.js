class sliderTextInput extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<label for="slider">Slider</label>
                          <input type="range" class="form-control-range-sm" min="1" max="10" value="1">
                          <label for="text">Text</label>
                          <input type="number" class="form-control-sm" min="1" max="10" value="1">`;
        
        let slider = this.children[1];
        let text = this.children[3];
        
        slider.addEventListener('input', function() {
            text.value = slider.value;
        });
        text.addEventListener('input', function() {
            if(text.value > 10) { text.value = 10;}
            slider.value = text.value;
        });
    }
}

customElements.define('slider-text-input', sliderTextInput);

Plotly.plot('graph', [{
    x: [],
    y: [],
    type: 'line',
    name: 'Sine',
}, {
    x: [],
    y: [],
    type: 'line',
    name: 'Cosine',     
}], );

let source = new EventSource('http://vmzakova.fei.stuba.sk/sse/sse.php');

source.addEventListener("message", logData = function (e) {
    console.log(e.data);
    let data = JSON.parse(e.data);
    let multiplier = document.getElementById('wc').children[1].value;
    Plotly.extendTraces('graph', { x:[[data.x]], y: [[data.y1 * multiplier]] }, [0] );
    Plotly.extendTraces('graph', { x:[[data.x]], y: [[data.y2 * multiplier]] }, [1] );
}, false);

let sine = document.getElementById('sine');
let cosine = document.getElementById('cosine');

sine.addEventListener('change', function(){
    if(sine.checked === false) {
        Plotly.restyle(document.getElementById("graph"), {"visible": false}, [0]);
    } else {
        Plotly.restyle(document.getElementById("graph"), {"visible": true}, [0]);
    }
    
});
cosine.addEventListener('change', function() {
    if(cosine.checked === false) {
        Plotly.restyle(document.getElementById("graph"), {"visible": false}, [1]);
    } else {
        Plotly.restyle(document.getElementById("graph"), {"visible": true}, [1]);
    }
});

let btn = document.getElementById('stop-button');

btn.addEventListener('click', function() {
    source.removeEventListener("message", logData);
    this.innerHTML = "Stopped";
});