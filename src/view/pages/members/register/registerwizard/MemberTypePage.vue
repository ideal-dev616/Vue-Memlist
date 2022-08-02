<template>
<!--"Medlemstyp"-->
    <div class="member-type m-auto">
        <b-card  hide-footer class="mb-2 mt-2 text-center cursor-pointer" @click="setType('normal')">
            <h4>
                Enskild medlem
            </h4>
        </b-card>
        <b-card hide-footer class="mb-2 mt-2 text-center cursor-pointer" @click="setType('family')">
            <h4 class="text-verti">
                Familjemedlemskap
            </h4>
        </b-card>
    </div>
</template>

<script>
    export default {
        name: "MemberTypePage",
        methods: {
            setType(type){
                this.$emit('setMemberType', type);
            }
        }
    }
</script>

<style scoped>
    .member-type{
        max-width: 285px;
    }
</style>