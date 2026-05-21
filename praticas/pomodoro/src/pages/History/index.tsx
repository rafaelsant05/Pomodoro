import { TrashIcon } from 'lucide-react';
import { Container } from '../../components/Container';
import { DefaultButton } from '../../components/DefaultButton';
import { Heading } from '../../components/Heading';
import { MainTemplate } from '../../templates/MainTemplate';
import styles from './styles.module.css';
import { useTaskContext } from '../../contexts/TaskContext/useTaskContext';
import { formatDate } from '../../utils/formatDate';
import { getTaskStatus } from '../../utils/getTaskStatus';
import { sortTasks, type SortTasksOptions } from '../../utils/sortTasks';
import { useEffect, useState } from 'react';
import { TaskActionTypes } from '../../contexts/TaskContext/taskActions';
import { showMessage } from '../../adapters/showMessage';
import { API_URL } from '../../config/api';
import type { TaskModel } from '../../models/TaskModel';

export function History() {
    const { state, dispatch } = useTaskContext();
    const [apiTasks, setApiTasks] = useState<TaskModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [sortTasksOptions, setSortTaskOptions] = useState<SortTasksOptions>({
        tasks: [],
        field: 'startDate',
        direction: 'desc',
    });

    useEffect(() => {
        document.title = 'Histórico - Chronos Pomodoro';
        setIsLoading(true);
        fetch(`${API_URL}/tasks`)
            .then(res => res.json())
            .then((data: TaskModel[]) => {
                const tasks = data.map(t => ({
                    ...t,
                    startDate: Number(t.startDate),
                    completeDate: t.completeDate ? Number(t.completeDate) : null,
                    interruptDate: t.interruptDate ? Number(t.interruptDate) : null,
                }));
                setApiTasks(tasks);
                setSortTaskOptions({
                    tasks: sortTasks({ tasks }),
                    field: 'startDate',
                    direction: 'desc',
                });
            })
            .catch(() => showMessage.error('Erro ao carregar histórico'))
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        return () => { showMessage.dismiss(); };
    }, []);

    function handleSortTasks({ field }: Pick<SortTasksOptions, 'field'>) {
        const newDirection = sortTasksOptions.direction === 'desc' ? 'asc' : 'desc';
        setSortTaskOptions({
            tasks: sortTasks({ direction: newDirection, tasks: apiTasks, field }),
            direction: newDirection,
            field,
        });
    }

    async function handleResetHistory() {
        showMessage.dismiss();
        showMessage.confirm('Tem certeza?', async confirmation => {
            if (!confirmation) return;
            try {
                await fetch(`${API_URL}/tasks`, { method: 'DELETE' });
                setApiTasks([]);
                setSortTaskOptions({ tasks: [], field: 'startDate', direction: 'desc' });
                dispatch({ type: TaskActionTypes.RESET_STATE });
                showMessage.success('Histórico apagado!');
            } catch {
                showMessage.error('Erro ao apagar histórico');
            }
        });
    }

    const hasTasks = sortTasksOptions.tasks.length > 0;

    return (
        <MainTemplate>
            <Container>
                <Heading>
                    <span>History</span>
                    {hasTasks && (
                        <span className={styles.buttonContainer}>
              <DefaultButton
                  icon={<TrashIcon />}
                  color='red'
                  aria-label='Apagar todo o histórico'
                  title='Apagar histórico'
                  onClick={handleResetHistory}
              />
            </span>
                    )}
                </Heading>
            </Container>

            <Container>
                {isLoading && <p style={{ textAlign: 'center' }}>Carregando...</p>}
                {!isLoading && hasTasks && (
                    <div className={styles.responsiveTable}>
                        <table>
                            <thead>
                            <tr>
                                <th onClick={() => handleSortTasks({ field: 'name' })} className={styles.thSort}>Tarefa ↕</th>
                                <th onClick={() => handleSortTasks({ field: 'duration' })} className={styles.thSort}>Duração ↕</th>
                                <th onClick={() => handleSortTasks({ field: 'startDate' })} className={styles.thSort}>Data ↕</th>
                                <th>Status</th>
                                <th>Tipo</th>
                            </tr>
                            </thead>
                            <tbody>
                            {sortTasksOptions.tasks.map(task => {
                                const taskTypeDictionary: Record<string, string> = {
                                    workTime: 'Foco',
                                    shortBreakTime: 'Descanso curto',
                                    longBreakTime: 'Descanso longo',
                                };
                                return (
                                    <tr key={task.id}>
                                        <td>{task.name}</td>
                                        <td>{task.duration}min</td>
                                        <td>{formatDate(task.startDate)}</td>
                                        <td>{getTaskStatus(task, state.activeTask)}</td>
                                        <td>{taskTypeDictionary[task.type]}</td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                )}
                {!isLoading && !hasTasks && (
                    <p style={{ textAlign: 'center', fontWeight: 'bold' }}>
                        Ainda não existem tarefas criadas.
                    </p>
                )}
            </Container>
        </MainTemplate>
    );
}