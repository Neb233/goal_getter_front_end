import React from "react";
import {
  StyleSheet,
  Button,
  TextInput,
  View,
  Text,
  ScrollView,
} from "react-native";

const SetGoalGuide = () => {
  return (
    <ScrollView>
      <Text>
        When setting goals, it is helpful to check whether they follow the SMART
        acronym:
      </Text>
      <Text>
        S - Specific - Goals should be focused and target a tangible outcome, if
        your goal is too vague it can be hard to know when you've achieved it
      </Text>
      <Text>
        M - Measurable - There needs to be a clear definition of success, if
        relevant it can be helpful to associate a numerical value
      </Text>
      <Text>
        A - Attainable - Your goal should challenge you and push you slightly
        outside your comfort zone, but first make sure it is reasonable for you
        to achieve
      </Text>
      <Text>
        R - Relevant - Make sure that your goal is worthy of your time and
        effort. If it isn't, not only is it not worth setting, it will also be
        harder to motivate yourself for
      </Text>
      <Text>
        T - Time-Bound - All the goals you set on Goalgetter will have an
        associated date to achieve it by, as a deadline helps to focus the mind
        and help you prioritise - make sure these time scales are realistic
        though
      </Text>
      <Text>
        Our philosophy is that in order for goals to be worthwhile, and show
        results, they generally need to be a large in scope, and take weeks or
        months, but when the end is so far away, it can become easy to become
        demotivated. Hence, we encourage our users to set smaller subgoals along
        with their goals, to break up what could be a daunting task into
        manageable pieces.
      </Text>
      <Text>
        We have some tools that can help you set these subgoals automatically.
        For example, if your final goal has a numerical target associated with
        it, we can break this up into smaller chunks, to give you a target to
        hit every few days, or weeks. Or you can add the subgoals in yourself,
        the choice is entirely up to you.
      </Text>
      <Text>Here are some examples of effective SMART goals.</Text>
      <Text>GOAL: Save £600 over the course of a year</Text>
      <Text>SUBGOALS: Save £50 each month</Text>
      <Text>GOAL: Pass a Spanish exam in two months</Text>
      <Text>SUBGOALS: Practice for at least an hour each week</Text>
      <Text>GOAL: Finish writing a screenplay in 7 months</Text>
      <Text>
        SUBGOALS: Write Act I in the first two months, Act II in the next two
        months, Act III in the two months after, and proofread in the final
        month
      </Text>
      <Text>
        We hope this guide has broadened your eyes to what can be achieved
        through careful planning of your goals - without further delay - start
        setting goals using these principles today to see self-improvement
        tomorrow.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 20,
  },
  errorText: {
    color: "crimson",
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 6,
  },
  input: {
    borderColor: "black",
    borderRadius: 10,
  },
});

export default SetGoalGuide;
