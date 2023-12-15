// Place url in a constant variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
  console.log(data);
});

// Function that builds the bar chart
function buildBarChart(sample) {
    d3.json(url).then((data) => {
        let bellybuttonInfo = data.samples;
        let value = bellybuttonInfo.filter(result => result.id == sample);

        let otuIds = value[0].otu_ids;
        let otuLabels = value[0].otu_labels;
        let sampleValues = value[0].sample_values;
        
        let trace = {
            x: sampleValues.slice(0,10).reverse(),
            y: otuIds.slice(0,10).map(id => `OTU ${id}`).reverse(),
            text: otuLabels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h"
        };

        let layout = {
            title: "Top 10 OTUs Present"
        };

        let traceData = [trace]

        Plotly.newPlot("bar", traceData, layout)
    });
};

// Function that builds the bubble chart
function buildBubbleChart(sample) {
    d3.json(url).then((data) => {
        let sampleInfo = data.samples;
        let samples = sampleInfo.filter(result => result.id == sample);

        let otuIds = samples[0].otu_ids;
        let otuLabels = samples[0].otu_labels;
        let sampleValues = samples[0].sample_values;

        let trace1 = {
            x: otuIds,
            y: sampleValues,
            text: otuLabels,
            mode: "markers",
            marker: {
                size: sampleValues,
                color: otuIds,
                colorscale: "Portland"
            }
        };

        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };

        let traceData1 = [trace1];

        Plotly.newPlot("bubble", traceData1, layout)
    });
};

// Function that populates metadata info
function buildMetadata(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {
        let metadata = data.metadata;
        let value = metadata.filter(result => result.id == sample);
        let valueData = value[0];

        // Clear out metadata
        d3.select("#sample-metadata").html("");

        // Use Object.entries to add each key/value pair to the panel
        Object.entries(valueData).forEach(([key,value]) => {

            // Log the individual key/value pairs as they are being appended to the metadata panel
            console.log(key,value);

            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });

};

// Create dropdown menu
function init() {
    let dropdownMenu = d3.select("#selDataset");
    d3.json(url).then((data) => {
        let names = data.names;
        names.forEach((id) => {
            console.log(id);
            dropdownMenu.append("option")
            .text(id)
            .property("value",id);
        });

        let sample_one = names[0];
        console.log(sample_one);

        // Build the initial plots
        buildMetadata(sample_one);
        buildBarChart(sample_one);
        buildBubbleChart(sample_one);

    });
};

// Call the initialize function
init();