let users = [
  { id: 1, name: "JavaScript", age: 10 },
  { id: 2, name: "JAVA", age: 20 },
  { id: 3, name: "C++", age: 30 },
  { id: 4, name: "Python", age: 40 },
  { id: 5, name: "Swift", age: 50 }
];

function filter(list, predicate) {
  let new_list = [];
  const max = list.length;
  for (let i = 0; i < max; i++) {
    if (predicate(list[i])) new_list.push(list[i]);
  }
  return new_list;
}

function map(list, iteratee) {
  let new_list = [];
  const max = list.length;
  for (let i = 0; i < max; i++) {
    new_list.push(iteratee(list[i]));
  }
  return new_list;
}

function bValue(key) {
  return function (obj) {
    return obj[key];
  };
}

function log_length(value) {
  console.log(value.length);
  return value;
}

function findById(list, id) {
  for (let i = 0, len = list.length; i < len; i++) {
    if (list[i].id == id) return list[i];
  }
}

function findByName(list, name) {
  for (let i = 0, len = list.length; i < len; i++) {
    if (list[i].name == name) return list[i];
  }
}

function findBy(list, key, val) {
  for (let i = 0, len = list.length; i < len; i++) {
    if (list[i][key] == val) return list[i];
  }
}

function User(id, name, age) {
  this.getId = () => id;
  this.getName = () => name;
  this.getAge = () => age;
}

function find(list, predicate) {
  for (let i = 0, len = list.length; i < len; i++) {
    if (predicate(list[i])) return list[i];
  }
}
