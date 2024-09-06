# DL using DDP on CTEAMD

# source
https://github.com/pytorch/pytorch#from-source

# notes
1. CTEAMD limits outgoing comm -- workaround is to link local machine with CTEAMD using\
`sshfs -o workaround=rename <user_name>@dt01.bsc.es: <local_folder>`\
use git commands in <local_folder>
2. to add new python libraries; (a) download wheels (.whl) or tarbals from https://pypi.org/ (only cp39 works) from local machine to CTEAMD with method above in #1, (b) copy the item to wheels folder (/gpfs/projects/bsc21/bsc21163/wheels), (c) update the `regs.txt` file in the project folder (/gpfs/projects/bsc21/bsc21163), and (d) run ./installWheels.sh in the project folder
3. TBL datasets are moved to `/gpfs/scratch/bsc21/bsc21163/RAISE_Dataset/T31/`

# isues
1. 

# to-do
1. 

# updates
1. updated to ROCm 5.1.1

# usage
add these commands to your batch script (on CTEAMD):\
`ml bsc gcc/10.2.0 openmpi/4.0.5 rocm/5.1.1 python/3.9.1` \
`source /gpfs/projects/bsc21/bsc21163/envAI_BSC/bin/activate`\
`export LD_LIBRARY_PATH=/gpfs/projects/bsc21/bsc21163/envAI_BSC/lib:$LD_LIBRARY_PATH`\
`export MIOPEN_DEBUG_DISABLE_FIND_DB=1`

# install (opt.)
run `./createENV.sh`
