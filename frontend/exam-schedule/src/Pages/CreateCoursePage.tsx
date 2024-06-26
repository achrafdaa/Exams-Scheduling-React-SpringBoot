import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CourseFormSchema } from "@/zod/schemas/course-schema.ts";
import { useCourse } from "@/context/CourseContext.tsx";
import {z} from "zod";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useProfs } from "@/context/ProfsContext";
import { useEffect,useState } from "react";
import { Prof } from "@/types/prof";

export default function CreateCoursePage() {
    const { createCourse } = useCourse();
    const {getProfs}=useProfs();
    const [professors, setProfessors] = useState<Prof[]>([]);

    const createCourseForm = useForm<z.infer<typeof CourseFormSchema>>({
        resolver: zodResolver(CourseFormSchema),
        defaultValues: {
            titre: "",
            nbrStudents: "0",
            typeElement: "ELEMENT",
            grade: "FIRST",
            professor: "",
        },
    });

    function onSubmit(values: z.infer<typeof CourseFormSchema>) {
        createCourse({
            titre: values.titre,
            nbrStudents: values.nbrStudents.toString(),
            typeElement: values.typeElement ,
            grade :values.grade,
            professor: JSON.stringify(professors.filter((prof) => prof.id?.toString() === values.professor)[0])
        });
    }
    useEffect(() => {
        const getProfessors = async () => {
            const professorData = await getProfs();
            setProfessors(professorData);
        };
        getProfessors();
    }, []);
    return (
        <Card className="bg-card border-0 shadow-none p-2 md:p-4 lg:p-10">
            <CardHeader className="p-3 md:p-6 mb-4">
                <CardTitle className="flex gap-x-2 items-center">
                    <span className="text-2xl md:text-3xl">Course Creation</span>
                </CardTitle>
                <CardDescription className="text-sm md:text-lg">Please fill the form with correct information</CardDescription>
            </CardHeader>
            <CardContent className="p-3 md:p-6">
                <Form {...createCourseForm}>
                    <form onSubmit={createCourseForm.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="mb-10">
                            <div className="flex flex-nowrap items-center gap-x-4 mb-6">
                                <div className="border-b w-[50px]" />
                                <span className="text-md whitespace-nowrap text-foreground/80">Course Information</span>
                                <div className="border-b w-full" />
                            </div>
                            <div className="grid grid-cols-1 gap-y-4">
                                <FormField
                                    control={createCourseForm.control}
                                    name="titre"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Course Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter course title" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={createCourseForm.control}
                                    name="nbrStudents"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Number of Students</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="Enter number of students" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={createCourseForm.control}
                                    name="typeElement"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Type</FormLabel>
                                            <FormControl>
                                                <Select value={field.value} onValueChange={field.onChange}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Course Type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectItem value="ELEMENT">ELEMENT</SelectItem>
                                                            <SelectItem value="MODULE">MODULE</SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                 <FormField
                                    control={createCourseForm.control}
                                    name="grade"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>grade</FormLabel>
                                            <FormControl>
                                                <Select value={field.value} onValueChange={field.onChange}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Course Type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectItem value="FIRST">FIRST</SelectItem>
                                                            <SelectItem value="SECONDE">SECONDE</SelectItem>
                                                            <SelectItem value="THIRD">THIRD</SelectItem>
                                                            <SelectItem value="FOURTH">FOURTH</SelectItem>
                                                            <SelectItem value="FIFTH">FIFTH</SelectItem>
                                                            
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={createCourseForm.control}
                                    name="professor"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Professor</FormLabel>
                                            <FormControl>
                                                <Select value={field.value} onValueChange={field.onChange}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select Professor" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            {professors.map((professor) => (
                                                                <SelectItem
                                                                    key={professor.id}
                                                                    value={professor.id ? professor.id.toString() : ''}
                                                                >
                                                                    {professor.firstName+' '+professor.lastName}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" className="space-x-2 w-full md:w-fit">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                <span>Create</span>
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
