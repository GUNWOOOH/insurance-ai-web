// Mock Data representing CUSTOMERS
const CUSTOMERS = {
    "900101-1234567": {
        name: "김현대",
        rrn: "910101-1234567",
        insurance_age: 33,
        gender: "남",
        job: "경영사무직 / 1급",
        consent: "동의",
        consent_end: "2026-12-11",
        contract_summary: {
            "현대해상": ["3건", "120,000원"],
            "손해보험": ["2건", "210,000원"],
            "생명보험": ["5건", "95,000원"],
            "기타": ["1건", "30,000원"]
        },
        history: [
            ["가입이력", "실손보험 가입(2022-05-01)"],
            ["가입이력", "건강보험 가입(2024-09-15)"],
            ["기왕력", "위염 치료 이력(경증, 완치)"],
            ["기왕력", "최근 5년 내 입원 없음"],
            ["기왕력", "3개월 내 추가 검사 없음"],
            ["기왕력", "혈압/당뇨 추가 고지사항 없음"],
            ["기가입", "운전자 특약 유지 중"]
        ],
        products: [
            "1순위  표준 2Q PASS",
            "2순위  퍼펙트종합(10년고지)",
            "3순위  내삶N(3.99)",
            "4순위  2Q PASS 내삶N(3.88)",
            "5순위  실속건강플랜"
        ],
        plans: [
            ["AI", "고객 개인화 추천", 1, "고객명", "L026-08701817", "표준 2Q PASS", "2026-05-15", "80,160", "20.8", "할증, 부담보", ""],
            ["AI", "베테랑 설계 따라하기", 2, "고객명", "L026-10815948", "퍼펙트 종합(10년고지)", "2026-05-15", "166,900", "14.5", "정상", ""],
            ["AI", "우리 지점 트렌드", 3, "고객명", "L026-11250053", "내삶엔 3.9.9.9", "2026-05-15", "151,950", "19.7", "누적조정", "메모"]
        ]
    },
    "900101-1000000": {
        name: "이샘플",
        rrn: "900101-1000000",
        insurance_age: 36,
        gender: "남",
        job: "사무직 / 1급",
        consent: "동의",
        consent_end: "2026-12-11",
        contract_summary: {
            "현대해상": ["1건", "89,000원"],
            "손해보험": ["1건", "110,000원"],
            "생명보험": ["2건", "72,000원"],
            "기타": ["0건", "0원"]
        },
        history: [
            ["가입이력", "운전자보험 가입(2023-03-04)"],
            ["기왕력", "알레르기 비염 통원 치료"],
            ["기왕력", "최근 2년 수술 이력 없음"],
            ["기왕력", "최근 3개월 약 처방 이력 없음"]
        ],
        products: [
            "1순위  원클릭 종합플랜",
            "2순위  실속 간편플랜",
            "3순위  표준 건강플랜",
            "4순위  운전자 결합플랜"
        ],
        plans: [
            ["AI", "고객 개인화 추천", 1, "이샘플", "SAMPLE-1001", "원클릭 종합", "2026-05-07", "74,300", "15.2", "정상", ""],
            ["AI", "베테랑 설계 따라하기", 2, "이샘플", "SAMPLE-1002", "실속 간편", "2026-05-07", "99,100", "13.8", "정상", ""],
            ["AI", "우리 지점 트렌드", 3, "이샘플", "SAMPLE-1003", "운전자 결합", "2026-05-07", "121,500", "11.2", "부담보", "메모"]
        ]
    }
};

let currentCustomer = null;

// DOM Elements
const screen1 = document.getElementById('screen1');
const screen2 = document.getElementById('screen2');
const screenTitle = document.getElementById('screen-title');
const rrnInput = document.getElementById('rrn-input');

// Screen 2 Data Elements
const custNameTitle = document.getElementById('cust-name-title');
const custInfoText = document.getElementById('cust-info-text');
const summaryGrid = document.getElementById('summary-grid');
const productList = document.getElementById('product-list');
const historyTbody = document.getElementById('history-tbody');
const planTbody = document.getElementById('plan-tbody');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Search Buttons
    document.getElementById('search-btn-icon').addEventListener('click', lookupCustomer);
    document.getElementById('search-btn-main').addEventListener('click', lookupCustomer);
    
    // AI Button
    document.getElementById('run-ai-btn').addEventListener('click', runAiDesign);
    
    // Close / Back Button
    document.getElementById('close-btn').addEventListener('click', () => {
        showScreen(1);
    });

    // Handle Enter Key in input
    rrnInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            lookupCustomer();
        }
    });

    // Modal Close
    document.getElementById('modal-close-btn').addEventListener('click', hideModal);
});

function showScreen(screenNum) {
    if (screenNum === 1) {
        screen1.classList.add('active');
        screen2.classList.remove('active');
        screenTitle.innerText = "1. 도입_고객정보 입력";
        currentCustomer = null;
        
        // Reset plans
        planTbody.innerHTML = '<tr class="empty-row"><td colspan="11">AI 설계를 실행해주세요.</td></tr>';
        resetStepper();
    } else {
        screen1.classList.remove('active');
        screen2.classList.add('active');
        screenTitle.innerText = "2. 설계 요청(동의고객)";
    }
}

function showAlert(title, message) {
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-message').innerText = message;
    document.getElementById('alert-modal').classList.add('show');
}

function hideModal() {
    document.getElementById('alert-modal').classList.remove('show');
}

function lookupCustomer() {
    const rrn = rrnInput.value.trim();
    const customer = CUSTOMERS[rrn];
    
    if (!customer) {
        showAlert("조회 결과", "샘플 데이터가 없습니다.\n900101-1234567 또는 900101-1000000 으로 테스트하세요.");
        return;
    }
    
    currentCustomer = customer;
    populateCustomer(customer);
    showScreen(2);
}

function populateCustomer(customer) {
    // Header
    custNameTitle.innerText = `${customer.name}  ${customer.rrn}`;
    
    // Info text
    custInfoText.innerHTML = `
        나이/성별 : ${customer.insurance_age}세 (${customer.gender})<br>
        직업정보 : ${customer.job}<br>
        개인정보 동의여부 : ${customer.consent}<br>
        동의종료일 : ${customer.consent_end}
    `;
    
    // Summary
    summaryGrid.innerHTML = '';
    const companies = ["현대해상", "손해보험", "생명보험", "기타"];
    companies.forEach(company => {
        const data = customer.contract_summary[company] || ["0건", "0원"];
        const div = document.createElement('div');
        div.className = 'summary-item';
        div.innerHTML = `
            <div class="label">${company}</div>
            <div class="value">${data[0]}<br>${data[1]}</div>
        `;
        summaryGrid.appendChild(div);
    });
    
    // Products
    productList.innerHTML = '';
    customer.products.forEach(prod => {
        const li = document.createElement('li');
        li.innerText = prod;
        productList.appendChild(li);
    });
    
    // History
    historyTbody.innerHTML = '';
    customer.history.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><span style="background: #f0f4f8; padding: 4px 8px; border-radius: 4px; font-size:12px; color: #2d6a9f; font-weight: 600;">${row[0]}</span></td>
            <td style="text-align: left; font-weight: 500;">${row[1]}</td>
        `;
        historyTbody.appendChild(tr);
    });
}

function runAiDesign() {
    if (!currentCustomer) {
        showAlert("안내", "먼저 고객 조회를 해주세요.");
        return;
    }
    
    // Clear and populate plans
    planTbody.innerHTML = '';
    currentCustomer.plans.forEach(plan => {
        const tr = document.createElement('tr');
        let html = '';
        plan.forEach((item, idx) => {
            if (idx === 9) {
                // 심사결과 badge
                let color = '#28a745';
                if (item.includes('부담보') || item.includes('할증')) color = '#dc3545';
                else if (item.includes('조정')) color = '#fd7e14';
                html += `<td><span style="color: ${color}; font-weight: 600;">${item}</span></td>`;
            } else if (idx === 1) {
                // 사유 badge
                html += `<td><span style="background: #eef2f7; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; color: #233b69; white-space: nowrap;">${item}</span></td>`;
            } else {
                html += `<td>${item}</td>`;
            }
        });
        tr.innerHTML = html;
        planTbody.appendChild(tr);
    });
    
    // Update Stepper
    document.getElementById('ai-review-step').classList.remove('active', 'highlight');
    document.getElementById('ai-review-step').classList.add('active');
    document.getElementById('compare-step').classList.add('active', 'highlight');
    
    // Show Modal
    showAlert("AI 설계 완료", `AI 원클릭 설계 결과로 ${currentCustomer.plans.length}개의 계약안이 생성되었습니다.`);
}

function resetStepper() {
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        step.className = 'step';
        if (index <= 2) step.classList.add('active', 'highlight');
        if (index === 0) step.classList.remove('highlight');
    });
}
