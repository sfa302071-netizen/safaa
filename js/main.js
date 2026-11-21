// ===== الخطوة 2: كلاس Student مع الكبسلة (حارس الأمان) =====
class Student {
  #name;
  #grade1;
  #grade2;
  #grade3;
  #attendance;

  constructor(name, grade1, grade2, grade3, attendance) {
    this.name = name;
    this.grade1 = grade1;
    this.grade2 = grade2;
    this.grade3 = grade3;
    this.attendance = attendance;
  }

  // دالة مساعدة للتحقق من الأرقام (0 - 100 وغير فارغ)
  static #validate(value, label) {
    if (value === "" || value === null || value === undefined || Number.isNaN(Number(value))) {
      throw new Error(`حقل "${label}" فارغ أو غير صالح.`);
    }
    const n = Number(value);
    if (n < 0 || n > 100) {
      throw new Error(`قيمة "${label}" يجب أن تكون بين 0 و 100.`);
    }
    return n;
  }

  get name() { return this.#name; }
  set name(value) {
    if (typeof value !== "string" || value.trim() === "") {
      throw new Error("اسم الطالب مطلوب ولا يمكن أن يكون فارغاً.");
    }
    this.#name = value.trim();
  }

  get grade1() { return this.#grade1; }
  set grade1(v) { this.#grade1 = Student.#validate(v, "درجة المادة الأولى"); }

  get grade2() { return this.#grade2; }
  set grade2(v) { this.#grade2 = Student.#validate(v, "درجة المادة الثانية"); }

  get grade3() { return this.#grade3; }
  set grade3(v) { this.#grade3 = Student.#validate(v, "درجة المادة الثالثة"); }

  get attendance() { return this.#attendance; }
  set attendance(v) { this.#attendance = Student.#validate(v, "نسبة الحضور"); }

  get average() {
    return (this.#grade1 + this.#grade2 + this.#grade3) / 3;
  }
}

// ===== الخطوة 3: التفاعل مع الشاشة =====
const studentsList = [];

const nameInput = document.getElementById("studentName");
const grade1Input = document.getElementById("grade1");
const grade2Input = document.getElementById("grade2");
const grade3Input = document.getElementById("grade3");
const attendanceInput = document.getElementById("attendance");
const addBtn = document.getElementById("addBtn");
const mercyBtn = document.getElementById("mercyBtn");
const errorBox = document.getElementById("errorBox");
const studentsBox = document.getElementById("studentsBox");
const reportBox = document.getElementById("reportBox");

function showError(message) {
  errorBox.textContent = message;
  errorBox.classList.remove("d-none");
}

function clearError() {
  errorBox.textContent = "";
  errorBox.classList.add("d-none");
}

function renderStudents() {
  studentsBox.innerHTML = studentsList
    .map(s => `
      <div class="student-item">
        <span>${escapeHtml(s.name)}</span>
        <span class="badge text-bg-secondary">المتوسط: ${s.average.toFixed(1)}</span>
      </div>`)
    .join("");
}

// حماية من إدخال وسوم HTML في الاسم
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

addBtn.onclick = function () {
  clearError();
  try {
    const student = new Student(
      nameInput.value,
      grade1Input.value,
      grade2Input.value,
      grade3Input.value,
      attendanceInput.value
    );
    studentsList.push(student);
    renderStudents();

    nameInput.value = "";
    grade1Input.value = "";
    grade2Input.value = "";
    grade3Input.value = "";
    attendanceInput.value = "";
    nameInput.focus();
  } catch (error) {
    showError(error.message);
  }
};

// ===== الخطوة 4: لجنة الرأفة =====
mercyBtn.onclick = function () {
  // Filter: المتوسط بين 40 و 49
  const struggling = studentsList.filter(s => s.average >= 40 && s.average <= 49);

  // Map: إضافة 5 درجات رأفة
  const afterMercy = struggling.map(s => ({
    name: s.name,
    newAverage: s.average + 5
  }));

  // Reduce: مجموع المتوسطات الجديدة
  const total = afterMercy.reduce((sum, s) => sum + s.newAverage, 0);
  const overall = afterMercy.length > 0 ? total / afterMercy.length : 0; // منع القسمة على صفر

  if (afterMercy.length === 0) {
    reportBox.innerHTML = `<p class="text-secondary mb-0">لا يوجد طلاب متعثرون (متوسطهم بين 40 و 49).</p>`;
    return;
  }

  reportBox.innerHTML = `
    <div class="report-stat">عدد الطلاب المتعثرين: <strong>${afterMercy.length}</strong></div>
    <div class="report-stat">
      الأسماء:
      <ul class="mb-0 mt-1">
        ${afterMercy.map(s => `<li>${escapeHtml(s.name)} — المتوسط بعد الرأفة: ${s.newAverage.toFixed(1)}</li>`).join("")}
      </ul>
    </div>
    <div class="report-stat">المتوسط العام بعد الرأفة: <strong>${overall.toFixed(2)}</strong></div>
  `;
};
