let selectedBaseCurrency = "krw"; // 기본 통화 초기값
let selectedTargetCurrency = "usd"; // 대상 통화 초기값

// 기본 통화 선택 함수
function selectBaseCurrency(currency) {
  selectedBaseCurrency = currency;

  // 모든 기본 통화 버튼에서 'selected' 클래스 제거
  const baseButtons = document.querySelectorAll(
    "#base-currency-buttons button"
  );
  baseButtons.forEach((button) => {
    button.classList.remove("selected");
  });

  // 선택된 버튼에 'selected' 클래스 추가
  const selectedButton = document.querySelector(
    `#base-currency-buttons button[onclick="selectBaseCurrency('${currency}')"]`
  );
  if (selectedButton) {
    selectedButton.classList.add("selected");
  }
}

// 대상 통화 선택 함수
function selectTargetCurrency(currency) {
  selectedTargetCurrency = currency;

  // 모든 대상 통화 버튼에서 'selected' 클래스 제거
  const targetButtons = document.querySelectorAll(
    "#target-currency-buttons button"
  );
  targetButtons.forEach((button) => {
    button.classList.remove("selected");
  });

  // 선택된 버튼에 'selected' 클래스 추가
  const selectedButton = document.querySelector(
    `#target-currency-buttons button[onclick="selectTargetCurrency('${currency}')"]`
  );
  if (selectedButton) {
    selectedButton.classList.add("selected");
  }
}

// 환율 데이터를 가져오는 함수
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

// 환율 변환 함수
async function convertCurrency() {
  const amountInput = document.getElementById("amount");
  const amount = amountInput.value.trim();
  const warningMessage = document.getElementById("warning");
  const resultDiv = document.getElementById("result");

  // 금액 입력 여부 및 유효성 검사
  if (!amount || isNaN(amount) || Number(amount) <= 0) {
    warningMessage.style.display = "block";
    resultDiv.innerText = "";
    return;
  } else {
    warningMessage.style.display = "none";
  }

  // 기본 통화와 대상 통화가 같은지 확인
  if (selectedBaseCurrency === selectedTargetCurrency) {
    resultDiv.innerText = "같은 나라에유;;";
    return;
  }

  try {
    const data = await fetchExchangeRate(selectedBaseCurrency);
    if (!data || !data[selectedBaseCurrency]) {
      throw new Error("환율 데이터를 찾을 수 없습니다.");
    }

    const rate = data[selectedBaseCurrency][selectedTargetCurrency];
    if (!rate) {
      throw new Error("선택한 통화의 환율을 찾을 수 없습니다.");
    }

    const convertedAmount = (Number(amount) * rate).toFixed(2);
    resultDiv.innerText = `${amount} ${selectedBaseCurrency.toUpperCase()} = ${convertedAmount} ${selectedTargetCurrency.toUpperCase()}`;
  } catch (error) {
    console.error(error);
    resultDiv.innerText = "환율 정보를 가져오지 못했습니다.";
  }
}

// 초기 선택 설정 (페이지 로드 시)
window.onload = function () {
  selectBaseCurrency(selectedBaseCurrency);
  selectTargetCurrency(selectedTargetCurrency);
};
