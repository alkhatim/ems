async function seed() {
  await new Contract({ name: "Normal" }).save();
  await new Job({ name: "Developer" }).save();
  await new Nationality({ name: "Sudanese" }).save();
  await new Property({
    name: "Basic Salary",
    category: "Salary",
    dataType: "Number"
  }).save();
  await new User({
    username: "alkhatim",
    password: "12345",
    roles: ["admin"]
  }).save();
}

seed();
