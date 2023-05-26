fetch("products.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return response.json();
  })
  .then((json) => initialize(json))
  .catch((err) => console.error(`Fetch problem: ${err.message}`));

function initialize(products) {
  // получаем переменные из кода

  const category = document.querySelector("#category");
  const bootsSection = document.getElementById("boots");
  const clothesSection = document.getElementById("clothes");
  const bagsSection = document.getElementById("bags");
  const scrollTopButton = document.getElementById("scrollTopButton");
  const header = document.querySelector("#header");

  // эти переменные содержат результаты фильтрации
  let categoryGroup;
  let finalGroup;

  // устанавливаем UpdateDisplay() чтобы все продукты отображались изначально
  finalGroup = products;
  updateDisplay();

  // задаем обоим пустой массив
  categoryGroup = [];
  finalGroup = [];

  category.addEventListener("change", selectCategory);

  function selectCategory(e) {
    e.preventDefault();

    if (category.value === "Обувь") {
      bootsSection.scrollIntoView({ behavior: "smooth" });
    } else if (category.value === "Одежда") {
      clothesSection.scrollIntoView({ behavior: "smooth" });
    } else if (category.value === "Сумки") {
      bagsSection.scrollIntoView({ behavior: "smooth" });

      if (category.value === "Все") {
      }
    }
  }

  window.addEventListener("scroll", function () {
    if (window.scrollY > 0) {
      scrollTopButton.classList.add("visible");
    } else {
      scrollTopButton.classList.remove("visible");
    }
  });

  scrollTopButton.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  function updateDisplay() {
    for (const product of finalGroup) {
      fetchBlob(product);
    }
  }

  function fetchBlob(product) {
    const url = `images/${product.image}`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        return response.blob();
      })
      .then((blob) => showProduct(blob, product))
      .catch((err) => console.error(`Fetch problem: ${err.message}`));
  }

  function getDayInfo(dateString) {
    const months = [
      "Января",
      "Февраля",
      "Марта",
      "Апреля",
      "Мая",
      "Июня",
      "Июля",
      "Августа",
      "Сентября",
      "Октября",
      "Ноября",
      "Декабря",
    ];

    const daysOfWeek = [
      "Понедельник",
      "Вторник",
      "Среда",
      "Четверг",
      "Пятница",
      "Суббота",
      "Воскресенье",
    ];

    const dateParts = dateString.split(".");
    const day = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1;
    const year = parseInt(dateParts[2]);

    const date = new Date(year, month, day);

    const dayOfWeek = daysOfWeek[date.getDay()];
    const weekNumber = Math.ceil(date.getDate() / 7);
    const monthName = months[month];

    return `${dayOfWeek}, ${weekNumber} неделя ${monthName} ${year} года`;
  }

  function showProduct(blob, product) {
    const objectURL = URL.createObjectURL(blob);

    // создаем нужыне нам элементы карточки товара
    const section = document.createElement("section");
    const heading = document.createElement("h3");
    const productPrice = document.createElement("p");
    const image = document.createElement("img");
    const dateAdded = document.createElement("span");
    const buyBtn = document.createElement("button");
    const groupOne = document.createElement("div");
    const groupTwo = document.createElement("div");

    section.setAttribute("class", product.type);

    buyBtn.innerHTML = "Купить";
    buyBtn.classList.add("btn");

    heading.textContent = product.name.replace(
      product.name.charAt(0),
      product.name.charAt(0).toUpperCase()
    );

    productPrice.textContent = `${product.price.toFixed(2)}₽`;
    dateAdded.innerHTML = `Добавлено на сайт: <br> ${getDayInfo(product.date)}`;

    image.src = objectURL;
    image.alt = product.name;
    dateAdded.classList.add("section__date");
    groupOne.classList.add("section__group_one");
    groupTwo.classList.add("section__group_two");

    if (product.type === "boots") {
      bootsSection.appendChild(section);
      section.appendChild(heading);
      section.appendChild(groupOne);
      groupOne.appendChild(image);
      groupOne.appendChild(groupTwo);
      groupTwo.appendChild(productPrice);
      groupTwo.appendChild(buyBtn);
      groupTwo.appendChild(dateAdded);
    } else if (product.type === "clothes") {
      clothesSection.appendChild(section);
      section.appendChild(heading);
      section.appendChild(groupOne);
      groupOne.appendChild(image);
      groupOne.appendChild(groupTwo);
      groupTwo.appendChild(productPrice);
      groupTwo.appendChild(buyBtn);
      groupTwo.appendChild(dateAdded);
    } else if (product.type === "bags") {
      bagsSection.appendChild(section);
      section.appendChild(heading);
      section.appendChild(groupOne);
      groupOne.appendChild(image);
      groupOne.appendChild(groupTwo);
      groupTwo.appendChild(productPrice);
      groupTwo.appendChild(buyBtn);
      groupTwo.appendChild(dateAdded);
    }

    /* модальное окно */
    const modal = document.getElementById("my_modal");
    const closeBtns = document.querySelectorAll(".close__modal");
    const orderBtn = document.querySelector(".order__btn");
    const openModals = document.querySelectorAll(".btn");

    // открываем модальное окно
    openModals.forEach((openModal) =>
      openModal.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        modal.style.display = "block";
      })
    );

    // отправляем заказ в корзину

    orderBtn.addEventListener("click", (e) => {
      orderBtn.id = product.id;
      e.preventDefault();

      if (+e.currentTarget.id === product.id) {
        alert(`Товар ${product.name} добавлен в корзину`);
      }
      console.log(product.id);
      console.log(e.currentTarget.id);

      modal.style.display = "none";
    });

    /* выбор цвета */
    const redBtn = document.getElementById("red");
    const blackBtn = document.getElementById("black");
    const whiteBtn = document.getElementById("white");
    const greenBtn = document.getElementById("green");
    const selectedColor = document.getElementById("selected__color");

    redBtn.addEventListener("click", function (e) {
      selectedColor.innerHTML = "Красный";
    });

    blackBtn.addEventListener("click", function (e) {
      selectedColor.innerHTML = "Черный";
    });

    whiteBtn.addEventListener("click", function (e) {
      selectedColor.innerHTML = "Белый";
    });

    greenBtn.addEventListener("click", function (e) {
      selectedColor.innerHTML = "Зеленый";
    });

    // закрываем модальное окно
    closeBtns.forEach((closeBtn) =>
      closeBtn.addEventListener("click", function (e) {
        e.preventDefault();
        modal.style.display = "none";
      })
    );

    const productCard = document.querySelector("section");

    if (header.classList.contains("dark")) {
      console.log("да");
      productCard.classList.toggle("dark_backgr");
    }
  }
}

/* Меняем тему */

const switchTheme = document.getElementById("checkbox");
const container = document.querySelector("body");
const header = document.querySelector("header");
const title = document.querySelector(".slider__title");
const selectCategory = document.querySelector("select");

switchTheme.addEventListener("click", function () {
  container.classList.toggle("dark__theme");
  header.classList.toggle("dark");
  selectCategory.classList.toggle("dark__backgr");

  if (header.classList.contains("dark")) {
    title.innerHTML = "Темная тема";
  } else title.innerHTML = "Светлая тема";
});
