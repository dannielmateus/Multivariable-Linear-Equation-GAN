// Input for multiple variables
// Adds a new input element every time the last one is used
treated = new Object()
inputNumber = 1
function addOne() {
    var element = document.createElement("input")
    inputNumber++
    element.setAttribute("id", "input" + inputNumber)
    element.setAttribute("onkeyup", "if (this.value.length > 0 && treated[this.id] != 1){ addOne(); treated[this.id] = '1'; }")
    var foo = document.getElementById("inputs")
    foo.appendChild(element)
}

// Constants
var output;
var minLoss;
var modelEpochs = 100
var lr = 0.5
var bestSolutions = 10
var totalSolutions = 1000

// Variables
var weights;
var layer;

// Running... 
function btnevent(){
    document.getElementById("startbtn").style.display = "none"
    document.getElementById("running").innerHTML = "Running..."
    setTimeout(() =>{
        start(totalSolutions)
    }, 0)
}

// Hide "Running..."
function done(){
    document.getElementById("startbtn").style.display = "inline"
    document.getElementById("running").innerHTML = ""
}

// Start the model
// "attempts" is the number of different solutions it will calculate
function start(attempts){
    // Hide start button
    document.getElementById("startbtn").style = "none"

    // Get inputs
    output = parseFloat(document.getElementById("output").value)
    minLoss = parseFloat(document.getElementById("loss").value)
    inputs = []
    for (var i = 1; i < inputNumber; i++){
        var input = String("input" + i)
        inputs.push(parseFloat(document.getElementById(input).value))
    }

    // Generate initial random weights (values for x, y, z, ...)
    function newWeights(){
        let weights = []
        for (var i = 0; i < inputs.length; i++){
            weights.push(Math.random())
        }
        return weights
    }
    weights = newWeights()

    // Create array with [a*x, b*y, c*z, ...] 
    function layerFunction(){
        let layer = []
        for (var i = 0; i < inputs.length; i++){
            layer.push(weights[i] * inputs[i])
        }
        return layer
    }
    var layer = layerFunction() 

    // Run the model
    // Return [x, y, z, ...]
    function run(){
        for (var i = 0; i < modelEpochs; i++){
            // Re-calculate layer
            var layer = layerFunction() 

            // Calculate N = a*x + b*y + c*z, ...]
            function sumFunction(){
                let sum = 0
                for (let j = 0; j < layer.length; j++) {
                    sum += layer[j];
                }
            return sum
            }
            a = sumFunction()

            // Calculate loss (expected N - calculated N)
            var loss = Math.abs(output - a)

            // Change weights and check if loss gets smaller
            if (loss < minLoss){
                break
            } else if (sumFunction() > output){
                for (var i = 0; i < weights.length; i++){
                    weights[i] -= lr * Math.random()
                }
            } else if (sumFunction() < output){
                for (var i = 0; i < weights.length; i++){
                    weights[i] += lr * Math.random()
                }        
            }
        }
        return weights
    }

    // Run the model multiple times to get the best results (simplest)
    function runMultipleResults(num){
        let comparison = []
        let results = []

        // Run the model num times
        // Gets multiple values for x, y, z, ...
        for (var i = 0; i < num; i++){
            weights = newWeights() 
            layer = layerFunction() 
            result = run() 

            // Comparison calculates x*y*z*... to get
            // the simplest possible results,
            // which means results with the smallest
            // x, y, z, ... values
            comparison.push(Math.abs(result.reduce((accumulator, current) => accumulator*current,1)))
            results.push(result)
        }

        // Sort comparison to get the smallest values, then push to best
        // results includes "num" results, all very different from each other
        comparisonC = [...comparison]
        sortComparison = comparison.sort()
        best = []
        for (var i = 0; i < bestSolutions; i++){
            best.push(results[comparisonC.indexOf(sortComparison[i])])
        }
        return [results, best]
    }

    // Get multiple results
    res = runMultipleResults(attempts)

    // Pick random result index to show
    pos = Math.round(Math.random() * res[0].length)
    mulpos = 0
    html1 = "["
    for (var i = 0; i < inputs.length; i++){
        mulpos += inputs[i] * res[0][pos][i]
        html1 += res[0][pos][i] + " , "
    }
    html1 += "] -> " + mulpos
    document.getElementById("p1").innerHTML = html1 

    // Create string with a random solution 
    // "Random solution: [x, y, z, ...] -> N"
    html_rnd = "Solutions are in the format [x, y, z, ...]<br><br>Random solution: ["
    for (var i = 0; i < inputs.length; i++){
        html_rnd += res[0][pos][i] 
        if (i < inputs.length - 1){
            html_rnd += " , "
        }
    }
    document.getElementById("p1").innerHTML = html_rnd + "] -> " + "<strong>" + mulpos + "</strong>" 

    // Create string with the best solutions
    // "Simplest solutions: 
    //  I. [x, y, z, ...] -> N"
    //  II. ...
    var html2 = []
    for (var i = 0; i < res[1].length; i++){
        var lin = []
        mul = 0
        for (var j = 0; j < inputs.length; j++){
            lin.push(res[1][i][j])
            mul += inputs[j] * res[1][i][j] 
        }
        html2.push("<li>" + "[" + lin.join(" , ") + "] -> " + "<strong>" + mul + "</strong>" + "</li>")
    }
    document.getElementById("best").innerHTML = "Simplest solutions: \n" + html2.join("") + "<br>" + "The loss is currently set to " + minLoss + ", lowering it may improve perfomance in cost of precision"

    done()
}
