async function convertCurrency(targetCurrency) {
  const amount = document.getElementById("amount").value;
  if (!amount) {
    document.getElementById("result").innerText = "금액을 입력하세요.";
    return;
  }

  try {
    const data = await fetchExchangeRate("krw"); // 기본 통화를 KRW로 설정
    const rate = data["krw"][targetCurrency];
    const convertedAmount = (amount * rate).toFixed(2);
    document.getElementById(
      "result"
    ).innerText = `${amount} KRW = ${convertedAmount} ${targetCurrency.toUpperCase()}`;
  } catch (error) {
    document.getElementById("result").innerText =
      "환율 정보를 가져오지 못했습니다.";
  }
}

async function fetchExchangeRate(baseCurrency) {
  const primaryUrl = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${baseCurrency}.json`;
  const fallbackUrl = `https://latest.currency-api.pages.dev/v1/currencies/${baseCurrency}.json`;

  try {
    const response = await fetch(primaryUrl);
    if (!response.ok) throw new Error("Primary API failed");
    return await response.json();
  } catch (error) {
    console.warn("Primary API failed, trying fallback", error);
    const response = await fetch(fallbackUrl);
    if (!response.ok) throw new Error("Fallback API failed");
    return await response.json();
  }
}
