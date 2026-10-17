
const passwordOutput = document.getElementById("password");
const lengthInput = document.getElementById("length");
const lengthValue = document.getElementById("lengthValue");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const message = document.getElementById("message");

const options = {
    uppercase: document.getElementById("uppercase"),
    lowercase: document.getElementById("lowercase"),
    numbers: document.getElementById("numbers"),
    symbols: document.getElementById("symbols")
};

const characterSets = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+-=[]{}?"
};

lengthInput.addEventListener("input", () => {
    lengthValue.textContent = lengthInput.value;
});

function randomIndex(max) {
    if (window.crypto && window.crypto.getRandomValues) {
        const limit = Math.floor(4294967296 / max) * max;
        const array = new Uint32Array(1);
        do {
            window.crypto.getRandomValues(array);
        } while (array[0] >= limit);
        return array[0] % max;
    }
    return Math.floor(Math.random() * max);
}

function shuffleCharacters(characters) {
    const array = characters.split("");

    for (let i = array.length - 1; i > 0; i--) {
        const j = randomIndex(i + 1);
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array.join("");
}

function generatePassword() {
    message.textContent = "";

    const selectedSets = Object.keys(options)
        .filter(key => options[key].checked)
        .map(key => characterSets[key]);

    if (selectedSets.length === 0) {
        passwordOutput.value = "";
        message.textContent = "Please select at least one character type.";
        return;
    }

    const length = Number(lengthInput.value);
    const allCharacters = selectedSets.join("");
    let password = "";

    // Include at least one character from each selected type.
    selectedSets.forEach(set => {
        password += set[randomIndex(set.length)];
    });

    while (password.length < length) {
        password += allCharacters[randomIndex(allCharacters.length)];
    }

    passwordOutput.value = shuffleCharacters(password).slice(0, length);
}

async function copyPassword() {
    const password = passwordOutput.value;

    if (!password) {
        message.textContent = "Generate a password first.";
        return;
    }

    try {
        await navigator.clipboard.writeText(password);
        message.textContent = "Password copied successfully!";
    } catch (error) {
        passwordOutput.focus();
        passwordOutput.select();
        message.textContent = "Copy failed. Select and copy the password manually.";
    }
}

generateBtn.addEventListener("click", generatePassword);
copyBtn.addEventListener("click", copyPassword);

generatePassword();
