function feetTOcm(feet){
    return feet * 30.48;
}

function poundsToKG(pounds){
    return pounds * 0.45359237;
}

function calculateBMI(weight, height) {
    if (weight <= 0 || height <= 0) {
        return "Invalid input";
    }
    return (weight / (height * height)).toFixed(2);
}

function convert(){
    const heightInput = heightElement.value;
    const heightUnit = heightUnitElement.value;

    const weightInput = weightElement.value;
    const weightUnit = weightUnitElement.value;

    let weightInKg;
    if (weightUnit === 'lbs') {
        weightInKg = poundsToKG(parseFloat(weightInput));
        if (!isNaN(weightInKg)) {
            weightElement.value = weightInKg.toFixed(2);
        }
    } else {
        weightInKg = parseFloat(weightInput.value);
    }

    if (heightUnit === 'feet') {
        const heightInFeet = parseFloat(heightInput);
        const heightInCm = feetTOcm(heightInFeet);
        if (!isNaN(heightInCm)) {
            heightElement.value = heightInCm.toFixed(2);
        }
    } else {
        heightElement.value = parseFloat(heightInput);
    }
}



function calculateBMIFromForm() {
    const heightElement = document.getElementById('height');
    const heightUnitElement = document.getElementById('height-unit');
    const weightElement = document.getElementById('weight');
    const weightUnitElement = document.getElementById('weight-unit');

    if (!heightElement || !heightUnitElement || !weightElement || !weightUnitElement) {
        console.error("One or more required elements are missing from the DOM.");
        return;
    }

    convert(); // Convert units if necessary

    

    const heightInMeters = parseFloat(heightInput.value) / 100; // Convert cm to meters
    const bmi = calculateBMI(weightInKg, heightInMeters);
    console.log("BMI:", bmi);
}