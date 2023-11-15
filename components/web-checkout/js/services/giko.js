const url = "https://gikolab.com";

export const getQuestions = async () => {
  const res = await fetch(`${url}/api/checkout/get_questions.php`);

  const data = await res.json();
  return data.data;
};

export const getLensesAndVariations = async () => {
  const res = await fetch(`${url}/api/checkout/get_lenses.php`);
  const data = await res.json();

  return data;
};