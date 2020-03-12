import re
import random
import uuid as UUID

word_file = "/usr/share/dict/words"
words = open(word_file).read().splitlines()

words = list(filter(lambda x: len(x) < 8, words))

f = open('Users.sql','r').readlines()
l = open('Lists.sql','r').readlines()

guid_finder = re.compile(r'[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}')
random.shuffle(l)
random.shuffle(f)

lists = [guid_finder.search(i).group(0) for i in l][:50]
uuids = [guid_finder.search(i).group(0)  for i in f]

format_s = "insert into Auth (UUID, LID, Permission) values ('{0}','{1}','{2}');"
format_i = "insert into Items (IID, UUID, LID, Name, Completed, Modified) values ('{0}','{1}','{2}','{3}','{4}',NULL);"


for uuid in uuids:
    random.shuffle(lists)
    yl = random.sample(lists, random.randint(1, 4))
    for i,v in enumerate(yl):
        a = 15
        if i == 0:
            print(format_s.format(uuid, v, "{0:04b}".format(a)))
        else:
            a = random.randint(1,15)
            print(format_s.format(uuid, v, "{0:04b}".format(a)))
        if (a & 2):
            for i in range(random.randint(0,5)):
                iid = UUID.uuid4()
                b = bool(random.randint(0,1))
                print(format_i.format(iid, uuid, v, random.choice(words), b))