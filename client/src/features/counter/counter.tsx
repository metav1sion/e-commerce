import { Button, ButtonGroup, Typography } from '@mui/material';
import { increment, decrement, incrementByAmount} from './counterSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';


function Counter() {
    const count = useAppSelector((state) => state.counter.value);
    const dispatch = useAppDispatch();
    
    return(
        <>
            <Typography>{count}</Typography>
            <ButtonGroup>
                <Button onClick={()=>dispatch(increment())}>Increment</Button>
                <Button onClick={()=>dispatch(decrement())}>Decrement</Button>
                <Button onClick={()=>dispatch(incrementByAmount(5))}>IncrementByAmount</Button>
            </ButtonGroup>
        </>
    )
}

export default Counter;