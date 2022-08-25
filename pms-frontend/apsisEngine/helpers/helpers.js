import fetchWrapper from "apsisEngine/helpers/fetchWrapper";
import { DangerousHtml } from "components/styles/Shared";
import moment from "moment";

const weatherIcons = {
  "01d": "/weather/day.svg",
  "02d": "/weather/cloudy-day-1.svg",
  "03d": "/weather/cloudy-day-2.svg",
  "04d": "/weather/cloudy-day-3.svg",
  "09d": "/weather/rainy-4.svg",
  "10d": "/weather/rainy-1.svg",
  "11d": "/weather/thunder.svg",
  "13d": "/weather/snowy-3.svg",
  "50d": "/weather/cloudy-day-3.svg",
  "01n": "/weather/night.svg",
  "02n": "/weather/cloudy-night-1.svg",
  "03n": "/weather/cloudy-night-2.svg",
  "04n": "/weather/cloudy-night-3.svg",
  "09n": "/weather/rainy-4.svg",
  "10n": "/weather/rainy-5.svg",
  "11n": "/weather/thunder.svg",
  "13n": "/weather/snowy-5.svg",
  "50n": "/weather/cloudy-day-3.svg",
};

export let uomPrecision =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("uom_precision"))
    : {
        DM: 2,
        KG: 2,
        KM: 2,
        L: 2,
        M: 2,
        MT: 2,
        Mbps: 2,
        O: 2,
        Pcs: 0,
        Ton: 2,
        gm: 2,
        lb: 2,
      };

// Capitalize
export function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function lowercase(string) {
  return string.toLowerCase();
}

// Format price
export function formatPrice(number) {
  const fnumber = parseFloat(number);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(fnumber);
}

// Get wind direction
export function windDirection(degree) {
  const sectors = ["n", "ne", "e", "se", "s", "sw", "w", "nw"];

  degree += 22.5;

  if (degree < 0) {
    degree = 360 - (Math.abs(degree) % 360);
  } else {
    degree = degree % 360;
  }

  const which = parseInt(degree / 45, 10);
  return sectors[which];
}

// Get weather icon class
export function getWeatherIcon(code, size) {
  const icon = weatherIcons[code];
  return (
    <span
      style={{
        background: `none, url(${icon}) no-repeat`,
        backgroundSize: `contain`,
        width: `${size}px`,
        height: `${size}px`,
        display: `inline-block`,
      }}
    />
  );
}

function toCamelCase(str) {
  return str
    .toLowerCase()
    .replace(/[-_]+/g, " ")
    .replace(/[^\w\s]/g, "")
    .replace(/ (.)/g, function ($1) {
      return $1.toUpperCase();
    })
    .replace(/ /g, "");
}

export function objectToCamelCase(origObj) {
  return Object.keys(origObj).reduce(function (newObj, key) {
    let val = origObj[key];
    let newVal = typeof val === "object" ? objectToCamelCase(val) : val;
    newObj[toCamelCase(key)] = newVal;
    return newObj;
  }, {});
}

export function cleanString(string) {
  let newString = !string ? "" : string.replaceAll("_", " ");
  return capitalize(newString);
}

export function apsisDate(string) {
  return !string ? "" : moment(string).format("DD-MM-YYYY");
}

export function apsisDateTime(string) {
  return !string ? "" : moment(string).format("DD-MM-YYYY, hh:mm A");
}

//array to Object conversion
export function stringToObjectArray(string) {
  const data = string.split(",");
  let result = [];
  for (let i = 0; i < data.length; ++i) {
    let obj = {};
    obj["label"] = data[i];
    obj["value"] = data[i];
    result.push(obj);
  }
  return result;
}

export function apsisMoney(amount, curreny = "", precision = 2) {
  if (amount && !isNaN(amount)) {
    const number = parseFloat(amount).toFixed(precision);
    const result = Intl.NumberFormat("en-IN").format(number);
    return `${result} ${curreny}`;
  } else if (!isNaN(amount)) {
    return `${amount} ${curreny}`;
  } else {
    ("");
  }
}

export function apsisQuantity(quantity, uom = "") {
  let data = 0;
  if (quantity && !isNaN(quantity)) {
    const precision = uomPrecision && uom ? uomPrecision[uom] : 2;
    const number = parseFloat(quantity).toFixed(precision);

    if (precision == 0) {
      data = number;
    } else {
      data = Intl.NumberFormat("en-IN", {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      }).format(number);
    }
  }

  return `${data} ${uom ?? ""}`;
}

export function apsisHtmlParse(string) {
  return (
    <DangerousHtml
      style={{ textAlign: "justify" }}
      dangerouslySetInnerHTML={{ __html: string }}
    ></DangerousHtml>
  );
}

//filter column
export function filterColumn(column, value, type) {
  let data = value !== null && value.value ? value.value : value;
	if (type === 'date') {
		data = apsisDate(data);
		return <td>{data}</td>;
	} else if (type === 'datetime') {
		data = apsisDateTime(data);
		return <td> {data} </td>;
	} else {
		return <td> {data} </td>;
	}
}

//right align
export function rightAlign(data) {
  return <div className="text-right">{data}</div>;
}

//center align
export function centerAlign(data) {
  return <div className="text-center">{data}</div>;
}

export function apsisNextWord(str) {
  if (!/^\d+$/.test(str) && /[0-9]+$/.test(str)) {
    const number = Number(String(str).match(/[0-9]+$/)[0]) + 1;
    const string = String(str).match(/^\D+/)[0];
    return string + number;
  } else {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const length = alphabet.length;
    let result = str;
    let i = str.length;

    while (i >= 0) {
      var last = str.charAt(--i),
        next = "",
        carry = false;

      if (isNaN(last)) {
        const index = alphabet.indexOf(last.toLowerCase());

        if (index === -1) {
          next = last;
          carry = true;
        } else {
          let isUpperCase = last === last.toUpperCase();
          next = alphabet.charAt((index + 1) % length);
          if (isUpperCase) {
            next = next.toUpperCase();
          }

          carry = index + 1 >= length;
          if (carry && i === 0) {
            let added = isUpperCase ? "A" : "a";
            result = added + next + result.slice(1);
            break;
          }
        }
      } else {
        next = +last + 1;
        if (next > 9) {
          next = 0;
          carry = true;
        }

        if (carry && i === 0) {
          result = "1" + next + result.slice(1);
          break;
        }
      }

      result = result.slice(0, i) + next + result.slice(i + 1);
      if (!carry) {
        break;
      }
    }
    return result;
  }
}

export function filterGridChangeProducts(productItems = [], value = []) {
  const oldValue = productItems.map((item) => item.product_id);
  const newValue = value.filter((item) => !oldValue.includes(parseInt(item)));
  let finalValue = [...new Set([...newValue, ...value])];
  productItems = productItems.filter((item) =>
    finalValue.includes(item.product_id.toString())
  );
  finalValue = finalValue.filter((id) => !oldValue.includes(parseInt(id)));
  return { productItems, finalValue };
}

export async function fetchProductData(ids = [], products = []) {
  return fetchWrapper
    .post("productdata", { product_id: ids })
    .then((response) => {
      if (!response.error) {
        response.data.forEach((element) => {
          products.push({
            key: element.product_id,
            product_id: element.product_id,
            product_name: element.product_name,
            product_code: element.product_code,
            trans_uom: element.default_uom,
            unit_price: element.last_purchase_price.toFixed(2),
            request_qty: 1,
            uoms_measurement: element.uoms_measurement,
            specifications: element.specifications ?? [],
            specificationsOthers: element.specificationsOthers ?? [],
          });
        });

        return products;
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

export const apsisTabChange = (index) => {
  if (index > 0) {
    window.history.replaceState(
      null,
      null,
      `${window.location.pathname}?tab=${index}`
    );
  } else {
    window.history.replaceState(null, null, `${window.location.pathname}`);
  }
};

export const envProducer = (type) => {
  const url = process.env.NEXT_PUBLIC_API_URL;

  if (type === "public") {
    return url.replace("api/v1", "");
  } else if (type === "api") {
    return url;
  }
  return url;
};

//Currency Num to Word
export const intToEnglish = (number, e) => {
  var NS = [
    { value: 10000000, str: "Crore" },
    { value: 100000, str: "Lakh" },
    { value: 1000, str: "Thousand" },
    { value: 100, str: "Hundred" },
    { value: 90, str: "Ninety" },
    { value: 80, str: "Eighty" },
    { value: 70, str: "Seventy" },
    { value: 60, str: "Sixty" },
    { value: 50, str: "Fifty" },
    { value: 40, str: "Forty" },
    { value: 30, str: "Thirty" },
    { value: 20, str: "Twenty" },
    { value: 19, str: "Nineteen" },
    { value: 18, str: "Eighteen" },
    { value: 17, str: "Seventeen" },
    { value: 16, str: "Sixteen" },
    { value: 15, str: "Fifteen" },
    { value: 14, str: "Fourteen" },
    { value: 13, str: "Thirteen" },
    { value: 12, str: "Twelve" },
    { value: 11, str: "Eleven" },
    { value: 10, str: "Ten" },
    { value: 9, str: "Nine" },
    { value: 8, str: "Eight" },
    { value: 7, str: "Seven" },
    { value: 6, str: "Six" },
    { value: 5, str: "Five" },
    { value: 4, str: "Four" },
    { value: 3, str: "Three" },
    { value: 2, str: "Two" },
    { value: 1, str: "One" },
  ];

  var result = "";
  for (var n of NS) {
    if (number >= n.value) {
      if (number <= 99) {
        result += n.str;
        number -= n.value;
        if (number > 0) result += " ";
      } else {
        var t = Math.floor(number / n.value);
        // console.log(t);
        var d = number % n.value;
        if (d > 0) {
          return intToEnglish(t) + " " + n.str + " " + intToEnglish(d);
        } else {
          return intToEnglish(t) + " " + n.str;
        }
      }
    }
  }
  return result;
};
