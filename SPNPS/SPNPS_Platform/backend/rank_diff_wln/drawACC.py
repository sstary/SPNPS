import matplotlib.pyplot as plt
import numpy as np

fig_M = 163
fig_acc_FuseNet = []
fig_acc_vFuseNet = []

it = 0
with open("acc", 'r') as f:
    lines = f.readlines()
    for line in lines:
        if 'after seeing 56' in line and 'molvs' in line:
            line = line.replace('\n', '').split(' ')
            acc = float(line[4].replace(',', ''))
            fig_acc_FuseNet.append(acc)
        if 'after seeing 10' in line and 'molvs' in line:
            line = line.replace('\n', '').split(' ')
            acc = float(line[4].replace(',', ''))
            fig_acc_vFuseNet.append(acc)
            it = it + 1

f.close()
fig_acc = []
for acc1, acc2 in zip(fig_acc_FuseNet, fig_acc_vFuseNet):
    fig_acc.append(acc1 + acc2)
max_index = fig_acc.index(max(fig_acc, key = abs))
print(max_index, fig_acc[max_index])

max_index = fig_acc_FuseNet.index(max(fig_acc_FuseNet, key = abs))
print(max_index, fig_acc_FuseNet[max_index])
max_index = fig_acc_vFuseNet.index(max(fig_acc_vFuseNet, key = abs))
print(max_index, fig_acc_vFuseNet[max_index])

# fig, ax1 = plt.subplots()
# plt.xticks(fontsize=20)
# plt.yticks(fontsize=20)
# # 设置坐标标签字体大小
# ax1.set_xlabel(..., fontsize=20)
# ax1.set_ylabel(..., fontsize=20)
#
# fig, ax1 = plt.subplots()
# lns1 = ax1.plot(np.arange(fig_M), fig_acc_FuseNet, label="train_acc", color='r')
# lns2 = ax1.plot(np.arange(fig_M), fig_acc_vFuseNet, label="train_acc", color='b')
#
# ax1.set_xlabel('iteration')
# ax1.set_ylabel('acc')
# lns = lns1 + lns2
# labels = ["FuseNet", "vFuseNet", "CFNet"]
# plt.legend(lns, labels, loc=0)
# plt.show()
