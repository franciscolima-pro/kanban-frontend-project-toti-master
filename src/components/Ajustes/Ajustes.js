function habilitarInput(inputId) {
    const inputElement = document.getElementById(inputId);
    const saveButton = document.getElementById('btn-salvar');

    if (inputElement) {
      inputElement.disabled = !inputElement.disabled; 
      saveButton.disabled = false;
      saveButton.style.backgroundColor = "#4CAF50";
    }
  };

  export default habilitarInput;