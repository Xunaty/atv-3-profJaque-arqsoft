class ClassroomActiveRecord {
  constructor(id, roomName) {
    this.id = id;
    this.roomName = roomName;
  }

  save() {
    console.log(`[Active Record] INSERT INTO classrooms (id, name) VALUES ('${this.id}', '${this.roomName}')`);
  }

  delete() {
    console.log(`[Active Record] DELETE FROM classrooms WHERE id = '${this.id}'`);
  }
}

class StudentDomainModel {
  #id;
  #name;
  #grades;

  constructor(id, name, grades = []) {
    this.#id = id;
    this.#name = name;
    this.#grades = grades;
  }

  getId() { return this.#id; }
  getName() { return this.#name; }

  calculateAverage() {
    if (this.#grades.length === 0) return 0;
    const sum = this.#grades.reduce((acc, curr) => acc + curr, 0);
    return sum / this.#grades.length;
  }
}

//
class StudentDataMapper {
  saveToDatabase(studentDomain) {
    console.log(`[Data Mapper] Mapeando atributos da entidade ${studentDomain.getName()} e salvando no BD...`);
  }
}
//
class StudentDTO {
  constructor(registration, fullName, average, status) {
    this.registration = registration;
    this.fullName = fullName;
    this.average = average;
    this.status = status;
  }
}

//
class StudentRepository {
  #dataMapper = new StudentDataMapper();

  findByRegistration(registration) {
    console.log(`[Repository] Buscando registros do aluno ${registration} no BD...`);
    //
    return new StudentDomainModel(registration, "Maria Silva", [9.0, 8.5, 10.0]);
  }

  save(student) {
    this.#dataMapper.saveToDatabase(student);
  }
}
//
const room = new ClassroomActiveRecord("LAB-01", "Laboratório de Informática");
room.save();

//
const studentRepo = new StudentRepository();
const studentEntity = studentRepo.findByRegistration("2026-IFPA-1020");

const average = studentEntity.calculateAverage();
const status = average >= 7.0 ? "Aprovado" : "Reprovado";

//
const dto = new StudentDTO(
  studentEntity.getId(),
  studentEntity.getName(),
  average,
  status
);

console.log("Objeto DTO pronto para resposta HTTP JSON:", JSON.stringify(dto, null, 2));
