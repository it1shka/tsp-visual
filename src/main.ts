class Person {
  constructor (
    readonly name: string,
    readonly surname: string,
    readonly age: number
  ) {}

  get greeting() {
    return `Hi! I am ${this.name} ${this.surname}`
  }
}

const me = new Person('Tikhon', 'Belousov', 18)
const greeting = me.greeting
console.log(greeting)