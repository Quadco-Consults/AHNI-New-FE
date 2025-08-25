"use client";

import FormCheckBox from "components/atoms/FormCheckBox";
import AddSquareIcon from "components/icons/AddSquareIcon";
import { Button } from "components/ui/button";
import { Form } from "components/ui/form";
import { Separator } from "components/ui/separator";
import { useForm } from "react-hook-form";
import EmptyTodoIcon from "components/icons/EmptyTodoIcon";

const Todo = () => {
  const todo = false;

  const form = useForm();
  return (
    <div className="space-y-10 max-w-2xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-medium">Task Todo</h2>
        <p className="text-small">
          List of tasks to do as agreed between employee and their supervisors.
        </p>
      </div>
      {todo ? (
        <Form {...form}>
          <form className="space-y-6">
            <div className="flex items-center pt-5 gap-x-4">
              <FormCheckBox name="isCompleted" />
              <div>
                <h4 className="text-lg font-medium">Employee Information</h4>
                <p className="text-small">Fill the employee information form</p>
              </div>
            </div>
            <Separator />

            <Button>
              <AddSquareIcon /> Add Task
            </Button>
          </form>
        </Form>
      ) : (
        <div className="grid place-content-center py-10 space-y-4 text-center">
          <EmptyTodoIcon />
          <p className="text-small">You have not created any task yet</p>
          <Button type="button">
            <AddSquareIcon /> Add Task
          </Button>
        </div>
      )}
    </div>
  );
};

export default Todo;
