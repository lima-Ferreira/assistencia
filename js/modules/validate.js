export default function validateForm() {
  const form = document.querySelectorAll(".form-control");
  const btnSalvarPdf = document.getElementById("salvar-pdf");

  form.forEach((formValue) => {
    const inputValidate = () => formValue.value.trim().length > 0;

    const handleForm = () => {
      const inputIsValid = inputValidate();

      if (!inputIsValid) {
        return formValue.classList.add("error");
      }
    };
    btnSalvarPdf.addEventListener("click", handleForm);
  });

  form.forEach((inputValid) => {
    const handleChange = (e) => {
      const inputIsValid = inputValid.value.trim().length > 0;
      if (inputIsValid) {
        return inputValid.classList.remove("error");
      }
    };
    inputValid.addEventListener("change", handleChange);
  });
}
