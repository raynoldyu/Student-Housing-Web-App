import React, { useState } from 'react';
import { Stack, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';

const PersonalityTest = ({ userCredentials, setUserCredentials }) => {
    const questions = [
        "I see myself as extraverted and enthusiastic",
        "I see myself as critical and quarrelsome.",
        "I see myself as dependable and self-disciplined.",
        "I see myself as anxious and more easily upset",
        "I see myself as open to new experiences.",
        "I see myself as reserved and quiet.",
        "I see myself as sympathetic and warm.",
        "I see myself as disorganized and careless.",
        "I see myself as calm and emotionally stable.",
        "I see myself as enjoying conventionality and familiarity."
    ];

    const [scores, setScores] = useState(Array.from({ length: 10 }, () => ""));

    const handleScoreChange = (event, questionNumber) => {
        const newScores = [...scores];
        newScores[questionNumber] = parseInt(event.target.value);
        setScores(newScores);
        handlePersonalityCalculator(scores)
    };

    const handlePersonalityCalculator = (scores) => {
        const extraversionScore = (scores[0] + (8 - scores[5])) / 2;
        const agreeablenessScore = (8 - scores[1] + scores[6]) / 2;
        const conscientiousnessScore = (scores[2] + (8 - scores[7])) / 2;
        const emotionalStabilityScore = (8 - scores[3] + scores[8]) / 2;
        const opennessScore = (scores[4] + (8 - scores[9])) / 2;

        setUserCredentials({...userCredentials,
            extraversion: extraversionScore,
            agreeableness: agreeablenessScore,
            conscientiousness: conscientiousnessScore,
            emotionalStability: emotionalStabilityScore,
            openness: opennessScore
        });
    };

    return (
        <Stack spacing={2} style={{ justifyContent: 'center', width: '100%' }}>
            {questions.map((question, index) => (
                <FormControl key={index} component="fieldset">
                    <FormLabel component="legend">{`Question ${index + 1}: ${question}`}</FormLabel>
                    <Stack direction="row" alignItems="center" justifyContent="center">
                        <FormLabel style={{ display: 'flex', justifyContent: 'center' }} component="legend">Strongly Disagree</FormLabel>
                        <FormLabel style={{ display: 'flex', justifyContent: 'center' }} component="legend">Strongly Agree</FormLabel>
                    </Stack>
                    <RadioGroup
                        aria-label={`Question ${index + 1}`}
                        name={`question${index}`}
                        value={scores[index]}
                        onChange={(event) => handleScoreChange(event, index)}
                        row
                        style={{ display: 'flex', justifyContent: 'center' }}
                    >
                        <FormControlLabel
                            value="1"
                            control={<Radio />}
                            label="1"
                        />
                        {[...Array(5).keys()].map(value => (
                            <FormControlLabel
                                key={value + 2}
                                value={value + 2}
                                control={<Radio />}
                                label={value + 2}
                            />
                        ))}
                        <FormControlLabel
                            value="7"
                            control={<Radio />}
                            label="7"
                        />
                    </RadioGroup>
                </FormControl>
            ))}
        </Stack>
    );
};

export default PersonalityTest;
