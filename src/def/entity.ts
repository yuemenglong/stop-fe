export class Clazz {
	id: number = undefined;
	crTime: string = undefined;
	name: string = undefined;
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
	courseType: CourseType = new CourseType();
	questions: Array<Question> = [];
	coursewares: Array<Courseware> = [];
	videos: Array<Video> = [];
}

export class CourseType {
	id: number = undefined;
	crTime: string = undefined;
	name: string = undefined;
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
	name: string = undefined;
	difficulty: string = undefined;
	students: Array<Student> = [];
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
	difficulty: string = undefined;
	students: Array<Student> = [];
}