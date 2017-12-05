export class Clazz {
	id: number = undefined;
	crTime: string = undefined;
	name: string = undefined;
	studentCount: number = undefined;
	students: Array<Student> = [];
}

export class Course {
	id: number = undefined;
	crTime: string = undefined;
	name: string = undefined;
	description: string = undefined;
	difficulty: string = undefined;
	questionCount: number = undefined;
	coursewareCount: number = undefined;
	videoCount: number = undefined;
	category: CourseCategory = new CourseCategory();
	questions: Array<Question> = [];
	coursewares: Array<Courseware> = [];
	videos: Array<Video> = [];
}

export class CourseCategory {
	id: number = undefined;
	crTime: string = undefined;
	name: string = undefined;
	level: number = undefined;
	parentId: number = undefined;
	parent: CourseCategory = undefined;
	children: Array<CourseCategory> = [];
}

export class Courseware {
	id: number = undefined;
	crTime: string = undefined;
	name: string = undefined;
	courseId: number = undefined;
	fileId: string = undefined;
	fileName: string = undefined;
	size: number = undefined;
	ext: string = undefined;
}

export class Question {
	id: number = undefined;
	crTime: string = undefined;
	courseId: number = undefined;
	title: string = undefined;
	score: number = undefined;
	ty: string = undefined;
	sc: QuestionChoice = new QuestionChoice();
	tf: QuestionTrueFalse = new QuestionTrueFalse();
}

export class QuestionChoice {
	id: number = undefined;
	crTime: string = undefined;
	opt1: string = undefined;
	opt2: string = undefined;
	opt3: string = undefined;
	opt4: string = undefined;
	answer: number = undefined;
	qt: Question = undefined;
}

export class QuestionTrueFalse {
	id: number = undefined;
	crTime: string = undefined;
	answer: boolean = undefined;
	qt: Question = undefined;
}

export class Student {
	id: number = undefined;
	crTime: string = undefined;
	loginName: string = undefined;
	userName: string = undefined;
	mobile: string = undefined;
	password: string = undefined;
	email: string = undefined;
	avatar: string = undefined;
	clazzId: number = undefined;
	clazz: Clazz = new Clazz();
}

export class StudyTask {
	id: number = undefined;
	crTime: string = undefined;
	dateLimit: string = undefined;
	clazz: Clazz = new Clazz();
	course: Course = new Course();
}

export class Team {
	id: number = undefined;
	crTime: string = undefined;
	name: string = undefined;
	students: Array<Student> = [];
}

export class Video {
	id: number = undefined;
	crTime: string = undefined;
	name: string = undefined;
	courseId: number = undefined;
	fileId: string = undefined;
	fileName: string = undefined;
	size: number = undefined;
	ext: string = undefined;
}